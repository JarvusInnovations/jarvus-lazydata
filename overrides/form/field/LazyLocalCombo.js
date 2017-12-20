Ext.define('Jarvus.override.form.field.LazyLocalCombo', {
    override: 'Ext.form.field.ComboBox',

    lazyAutoLoad: true,

    doQuery: function doQuery(rawQuery) {
        var me = this,
            args = arguments,
            previous = args.callee.$previous;

        me.lastRawQuery = rawQuery;

        me.doLazyLoad(true, function() {
            previous.apply(me, args);
        });
    },

    setValue: function(value) {
        var me = this,
            args = arguments,
            previous = args.callee.$previous;

        if (Ext.isEmpty(value)) {
            previous.apply(me, args);
        } else {
            me.doLazyLoad(false, function() {
                previous.apply(me, args);
            });
        }
    },

    doLazyLoad: function(expandBeforeLoad, callback) {
        var me = this,
            store = me.getStore(),
            onLoad;

        // do nothing if there's nothing to do
        if (me.queryMode != 'local' || !me.lazyAutoLoad || store.isLoaded()) {
            Ext.callback(callback);
            return;
        }

        onLoad = function() {
            var lastRawQuery = me.lastRawQuery;

            if (lastRawQuery) {
                me.lastRawQuery = null;
                me.setRawValue(lastRawQuery);
            }

            Ext.callback(callback);
        };

        if (store.isLoading()) {
            store.on('load', onLoad, me, { single: true });
        } else {
            if (expandBeforeLoad) {
                me.expand();
            }

            store.load({ callback: onLoad });
        }
    }
});
