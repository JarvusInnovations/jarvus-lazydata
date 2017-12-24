Ext.define('Jarvus.override.data.RequireLoadedStores', {
    override: 'Ext.data.StoreManager',

    requireLoaded: function(stores, callback, scope) {
        var me = this,
            queue = Ext.Array.clone(stores),
            storeLoaded;

        storeLoaded = function(loadedStoreId) {
            Ext.Array.remove(queue, loadedStoreId);

            if (!queue.length) {
                Ext.callback(callback, scope || me);
            }
        };

        Ext.Array.each(stores, function(storeId) {
            var store = me.lookup(storeId);

            if (store.isLoaded()) {
                storeLoaded(storeId);
                return;
            }

            store.on('load', function() {
                storeLoaded(storeId);
            }, me, { single: true });

            if (!store.isLoading()) {
                store.load();
            }
        });
    }
});