/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true */
/* global Ext */
Ext.define('Jarvus.touch.override.data.RequireLoadedStores', {
    override: 'Ext.data.StoreManager',
    
    requireLoaded: function(stores, callback, scope) {
        var me = this,
            queue,
            _storeLoaded;

        if (stores && !Ext.isArray(stores)) {
            stores = [stores];
        }

        if (!stores || !stores.length) {
            Ext.callback(callback, scope || me);
            return;
        }

        queue = Ext.Array.clone(stores);

        _storeLoaded = function(loadedStoreId) {
            Ext.Array.remove(queue, loadedStoreId);

            if (!queue.length) {
                Ext.callback(callback, scope || me);
            }
        };
        
        Ext.Array.each(stores, function(storeId) {
            var store = me.lookup(storeId);
            
            if (store.isLoaded()) {
                _storeLoaded(storeId);
                return;
            }
            
            store.on('load', function() {
                _storeLoaded(storeId);
            }, me, {single: true});
            
            if (!store.isLoading()) {
                store.load();
            }
        });
    }
});