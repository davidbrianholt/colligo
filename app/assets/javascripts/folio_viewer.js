$(function() {
    var viewer = $("#folio_viewer");
    if (viewer.length == 0) {
        return;
    }

    // Initialize the mirador viewer
    var vc = $("#viewer_container");
    var manifest_uri = viewer.data("manifest-uri");
    var canvas_id = viewer.data("canvas-id");
    viewer.width(vc.width());
    // var display_ratio = 1/(1.618 * 2);
    viewer.height(viewer.width() * 1.25);
    Mirador({
        "id": "folio_viewer",
        "layout": "1x1",
        "mainMenuSettings" : {
            'show' : false
        },
        'showAddFromURLBox' : false,
        "saveSession": false,
        "data": [
            {
                "manifestUri": manifest_uri,
                "location": "Stanford University"}
        ],
        "windowObjects": [
            {
                "loadedManifest": manifest_uri,
                "canvasID" : canvas_id,
                "viewType" : "ImageView",
                "displayLayout": false,
                "bottomPanel" : false,
                "sidePanel" : false,
                "annotationLayer" : true,
                "annotationState": 'annoOnCreateOff'
            }
        ]
    });
    viewer.css('position', 'relative');
    var viewer_text = $("#viewer_text");
    viewer_text.height(viewer.height());
    viewer_text.css('overflow', 'hidden');
    var text_class = 'transcription_text';
    if ($('.folio-tabs li.active').data('tab-id') == 'annotations') {
        text_class = 'annotation_text';
    }
    var delta_left = viewer_text.offset().left - viewer.offset().left;
    var viewer_text_left = viewer_text.offset().left;
    var viewer_text_width = viewer_text.outerWidth();
    var max_text_length = get_max_text_length(text_class);

    // var delta_top = viewer_text.offset().top - viewer.offset().top;

    var anno_check_count = 0;
    $.subscribe('imageRectangleUpdated', image_rect_updated_handle);
    $.subscribe('focusUpdated', focus_updated_handle);

    function image_rect_updated_handle(event, data) {
        var win_id = data['id'];
        anno_check_count += 1;
        var annos = $(".annotation");
        var texts = $("." + text_class);
        if (annos.length == 0 &&  anno_check_count < 5) {
            setTimeout(image_rect_updated_handle, 1, event, data);
        } else {
            $.publish('disableTooltips.' + win_id);
            var index = 0;
            var number_of_cols = get_annotation_columns(annos);
            var col_width = viewer_text_width / number_of_cols;
            var font_ratio = get_font_ratio(max_text_length, number_of_cols);
            annos.each(function(){
                var p = $(this).offset();
                var w = $(this).outerWidth();
                var h = $(this).outerHeight();
                // Set the col width to the max if the anno box is less than the max width
                // If anno box is greater than the max, use that (i.e zoomed in)
                // Offset the width by height, to account for start of text within the annotation box
                var screen_w = col_width - p.left - delta_left - (h/2) + viewer_text_left;
                if (texts.length > index) {
                    $(texts[index]).offset({top: p.top + (h/3), left: p.left + delta_left + (h/2)});
                    if (w < screen_w) {
                        $(texts[index]).width(screen_w);
                    } else {
                        $(texts[index]).width(w);
                    }
                    $(texts[index]).flowtype({
                        //minFont : 6,
                        //maxFont : 40
                        fontRatio : font_ratio
                    });
                    index = index + 1;
                }
            });
            // $.publish('disableRectTool.' + win_id);
        }
    }

    function focus_updated_handle() {
        anno_check_count = 0;
    }

    function get_max_text_length(text_class) {
        var max_length = 0;
        $("." + text_class).each(function(){
            var tn = $(this).text().length;
            if (tn > max_length) {
                max_length = tn;
            }
        });
        return max_length;
    }

    function get_annotation_columns(annos) {
        var cols = [];
        annos.each(function(){
            var l = $(this).offset().left;
            if (cols.indexOf(l) == -1) {
                cols.push(l);
            }
        });
        return cols.length;
    }

    function get_font_ratio(max_text_length, number_of_cols) {
        var ideal_text_length = 75;
        var text_length_for_col = ideal_text_length / number_of_cols;
        if (max_text_length > text_length_for_col) {
            return 40
        } else {
            return 30
        }
    }

});