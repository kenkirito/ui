import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
  catalog: Ember.inject.service(),
  settings: Ember.inject.service(),

  model() {
    let def = JSON.parse(this.get(`settings.${C.SETTING.CLUSTER_TEMPLATE}`)) || {};
    (def.systemStacks||[]).forEach((stack) => {
      stack.type = 'stack';
    })
    def.type = 'cluster';

    return this.get('catalog').fetchTemplates({plusInfra: true}).then((templates) => {
      return Ember.Object.create({
        cluster: this.get('userStore').createRecord(def),
        allTemplates: templates
      });
    });
  },
  teardownForComponentState: Ember.on('deactivate', function(){
    this.controller.setProperties({
      catalogItem:         null,
      editCatalog:         false,
      selectedTemplateUrl: null,
      catalogInfo:         null,
      _catalogInfoCache:   null,
      _prefetchInstance:   null,
      catalogId:           'all',
      category:            null,
      viewCatalog:         false,
      newSystemStack:      null,
    });
  })
});
