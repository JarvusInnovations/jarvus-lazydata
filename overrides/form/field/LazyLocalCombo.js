Ext.define('Jarvus.override.form.field.LazyLocalCombo', {
    override: 'Ext.form.field.ComboBox',

    lazyAutoLoad: true,

    doQuery: function doQuery() {
        var me = this,
            args = arguments,
            previous = args.callee.$previous;

        this.doLazyLoad(function() {
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
            this.doLazyLoad(function() {
                previous.apply(me, args);
            });
        }
    },

    doLazyLoad: function(callback) {
        var me = this,
            store = me.getStore(),
            isLoading = store.isLoading(),
            rawValue = me.getRawValue(),
            onLoad = function() {
                me.setRawValue(rawValue);
                Ext.callback(callback);
            };

        if (me.queryMode == 'local' && me.lazyAutoLoad && !isLoading && !store.isLoaded()) {
            me.expand();
            store.load({ callback: onLoad });
        } else if (isLoading) {
            store.on('load', onLoad, me, { single: true });
        } else {
            Ext.callback(callback);
        }
    }
});
