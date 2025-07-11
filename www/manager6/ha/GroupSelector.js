Ext.define(
    'PVE.ha.GroupSelector',
    {
        extend: 'Proxmox.form.ComboGrid',
        alias: ['widget.pveHAGroupSelector'],

        autoSelect: false,
        valueField: 'group',
        displayField: 'group',
        listConfig: {
            columns: [
                {
                    header: gettext('Group'),
                    width: 100,
                    sortable: true,
                    dataIndex: 'group',
                },
                {
                    header: gettext('Nodes'),
                    width: 100,
                    sortable: false,
                    dataIndex: 'nodes',
                },
                {
                    header: gettext('Comment'),
                    flex: 1,
                    dataIndex: 'comment',
                    renderer: Ext.String.htmlEncode,
                },
            ],
        },
        store: {
            model: 'pve-ha-groups',
            sorters: {
                property: 'group',
                direction: 'ASC',
            },
        },

        initComponent: function () {
            var me = this;
            me.callParent();
            me.getStore().load();
        },
    },
    function () {
        Ext.define('pve-ha-groups', {
            extend: 'Ext.data.Model',
            fields: [
                'group',
                'type',
                'digest',
                'nodes',
                'comment',
                {
                    name: 'restricted',
                    type: 'boolean',
                },
                {
                    name: 'nofailback',
                    type: 'boolean',
                },
            ],
            proxy: {
                type: 'proxmox',
                url: '/api2/json/cluster/ha/groups',
            },
            idProperty: 'group',
        });
    },
);
