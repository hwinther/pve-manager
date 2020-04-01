Ext.define('PVE.sdn.StatusView', {
    extend: 'Ext.grid.GridPanel',
    alias: ['widget.pveSDNStatusView'],

    sortPriority: {
	quorum: 1,
	master: 2,
	lrm: 3,
	service: 4
    },
    
    initComponent : function() {
	var me = this;

	if (!me.rstore) {
	    throw "no rstore given";
	}

	Proxmox.Utils.monStoreErrors(me, me.rstore);

	var store = Ext.create('Proxmox.data.DiffStore', {
	    rstore: me.rstore,
	    sortAfterUpdate: true,
	    sorters: [{
		sorterFn: function(rec1, rec2) {
		    var p1 = me.sortPriority[rec1.data.type];
		    var p2 = me.sortPriority[rec2.data.type];
		    return (p1 !== p2) ? ((p1 > p2) ? 1 : -1) : 0;
		}
	    }],
	    filters: {
		property: 'type',
		value: 'sdn',
		operator: '=='
	    }
	});

	Ext.apply(me, {
	    store: store,
	    stateful: false,
            tbar: [
                {
                    text: gettext('Apply'),
                    handler: function() {
                        Proxmox.Utils.API2Request({
                            url: '/cluster/sdn/',
                            method: 'PUT',
                            waitMsgTarget: me,
                            failure: function(response, opts) {
                                Ext.Msg.alert(gettext('Error'), response.htmlStatus);
                            }
                        });
                    }
                },
            ],
	    viewConfig: {
		trackOver: false
	    },
	    columns: [
		{
		    header: gettext('sdn'),
		    width: 80,
		    dataIndex: 'sdn'
		},
		{
		    header: gettext('node'),
		    width: 80,
		    dataIndex: 'node'
		},
		{
		    header: gettext('Status'),
		    width: 80,
		    flex: 1,
		    dataIndex: 'status'
		}
	    ]
	});

	me.callParent();

	me.on('activate', me.rstore.startUpdate);
	me.on('destroy', me.rstore.stopUpdate);	

    }
}, function() {

    Ext.define('pve-sdn-status', {
	extend: 'Ext.data.Model',
	fields: [ 
	    'id', 'type', 'node', 'status', 'sid',
	    'state', 'group', 'comment',
	    'max_restart', 'max_relocate', 'type',
	    'crm_state', 'request_state'
	],
	idProperty: 'id'
    });

});