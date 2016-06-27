require 'spec_helper'

describe '/catalog/_search_form.html.erb' do
  describe 'it should have search form with descriptions selected' do
    before(:each) do
      allow(view).to receive(:search_action_url).and_return('/')
      allow(view).to receive(:blacklight_config).and_return(CatalogController.new.blacklight_config)
      allow(view).to receive(:params).and_return(search_field: 'descriptions')
      render
    end
    it 'should have select list' do
      expect(rendered).to have_css('form.search-query-form select#search_field')
    end
    it 'should have 4 options' do
      expect(rendered).to have_css('form.search-query-form select#search_field option', count: 4)
    end
    it 'should have all_fields' do
      expect(rendered).to have_css('form.search-query-form select option[value=all_fields]', text: 'All Content')
    end
    it 'should have descriptions as the selected option' do
      expect(rendered).to have_css('form.search-query-form select option[value=descriptions][selected=selected]', text: 'Descriptions')
    end
    it 'should have transcriptions option' do
      expect(rendered).to have_css('form.search-query-form select option[value=transcriptions]', text: 'Transcriptions')
    end
    it 'should have annotations tab' do
      expect(rendered).to have_css('form.search-query-form select option[value=annotations]', text: 'Annotations')
    end
    it 'should have a text field' do
      expect(rendered).to have_css('form.search-query-form input[type=text][name=q]')
    end
    it 'should have an submit button' do
      expect(rendered).to have_css('form.search-query-form button[type=submit]')
      expect(rendered).to have_css('form.search-query-form button[type=submit] span.glyphicon-search')
    end
  end
  describe 'it should have search form with transcriptions selected' do
    before(:each) do
      allow(view).to receive(:search_action_url).and_return('/')
      allow(view).to receive(:blacklight_config).and_return(CatalogController.new.blacklight_config)
      allow(view).to receive(:params).and_return(search_field: 'transcriptions')
      render
    end
    it 'should have 4 options' do
      expect(rendered).to have_css('form.search-query-form select#search_field option', count: 4)
    end
    it 'should have descriptions option' do
      expect(rendered).to have_css('form.search-query-form select option[value=descriptions]', text: 'Descriptions')
    end
    it 'should have transcriptions as the selected option' do
      expect(rendered).to have_css('form.search-query-form select option[value=transcriptions][selected=selected]', text: 'Transcriptions')
    end
  end
end
