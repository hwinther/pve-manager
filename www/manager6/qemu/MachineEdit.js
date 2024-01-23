Ext.define('PVE.qemu.MachineInputPanel', {
    extend: 'Proxmox.panel.InputPanel',
    xtype: 'pveMachineInputPanel',

    controller: {
	xclass: 'Ext.app.ViewController',
	control: {
	    'combobox[name=machine]': {
		change: 'onMachineChange',
	    },
	},
	onMachineChange: function(field, value) {
	    let me = this;
	    let version = me.lookup('version');
	    let store = version.getStore();
	    let oldRec = store.findRecord('id', version.getValue(), 0, false, false, true);
	    let type = 'i440fx';
	    if (value === 'q35') { type = 'q35'; }
	    if (value === 'virt') { type = 'virt'; }
	    if (value === 'sun') { type = 'sun'; }
	    store.clearFilter();
	    store.addFilter(val => val.data.id === 'latest' || val.data.type === type);
	    if (!me.getView().isWindows) {
		version.setValue('latest');
	    } else {
		store.isWindows = true;
		if (!oldRec) {
		    return;
		}
		let oldVers = oldRec.data.version;
		// we already filtered by correct type, so just check version property
		let rec = store.findRecord('version', oldVers, 0, false, false, true);
		if (rec) {
		    version.select(rec);
		}
	    }
	},
    },

    onGetValues: function(values) {
	if (values.version && values.version !== 'latest') {
	    values.machine = values.version;
	    delete values.delete;
	}
	delete values.version;
	return values;
    },

    setValues: function(values) {
	let me = this;

	me.isWindows = values.isWindows;
	if (values.machine === 'pc') {
	    values.machine = '__default__';
	}

	if (me.isWindows) {
	    if (values.machine === '__default__') {
		values.version = 'pc-i440fx-5.1';
	    } else if (values.machine === 'q35') {
		values.version = 'pc-q35-5.1';
	    }
	}

	if (values.machine !== '__default__' && values.machine !== 'q35') {
	    values.version = values.machine;
	    // values.machine = values.version.match(/q35/) ? 'q35' : '__default__';
	    if (values.version.match(/q35/)) {
	        values.machine = 'q35';
	    } else if (values.version.match(/virt/)) {
	        values.machine = 'virt';
	    } else if (values.version.match(/sun/)) {
	        values.machine = 'sun';
	    } else {
	        values.machine = '__default__';
	    }

	    // avoid hiding a pinned version
	    me.setAdvancedVisible(true);
	}

	this.callParent(arguments);
    },

    items: {
	xtype: 'proxmoxKVComboBox',
	name: 'machine',
	reference: 'machine',
	fieldLabel: gettext('Machine'),
	comboItems: [
	    ['__default__', PVE.Utils.render_qemu_machine('')],
	    ['q35', 'q35'],
	    ['virt', 'aarch64 virt'],
	    ['sun', 'sparc64 sun'],
	],
    },

    advancedItems: [
	{
	    xtype: 'combobox',
	    name: 'version',
	    reference: 'version',
	    fieldLabel: gettext('Version'),
	    emptyText: gettext('Latest'),
	    value: 'latest',
	    editable: false,
	    valueField: 'id',
	    displayField: 'version',
	    queryParam: false,
	    store: {
		autoLoad: true,
		fields: ['id', 'type', 'version'],
		proxy: {
		    type: 'proxmox',
		    url: "/api2/json/nodes/localhost/capabilities/qemu/machines",
		},
		listeners: {
		    load: function(records) {
			if (!this.isWindows) {
			    this.insert(0, { id: 'latest', type: 'any', version: gettext('Latest') });
			}
		    },
		},
	    },
	},
	{
	    xtype: 'displayfield',
	    fieldLabel: gettext('Note'),
	    value: gettext('Machine version change may affect hardware layout and settings in the guest OS.'),
	},
    ],
});

Ext.define('PVE.qemu.MachineEdit', {
    extend: 'Proxmox.window.Edit',

    subject: gettext('Machine'),

    items: {
	xtype: 'pveMachineInputPanel',
    },

    width: 400,

    initComponent: function() {
	let me = this;

	me.callParent();

	me.load({
	    success: function(response) {
		let conf = response.result.data;
		let values = {
		    machine: conf.machine || '__default__',
		};
		values.isWindows = PVE.Utils.is_windows(conf.ostype);
		me.setValues(values);
	    },
	});
    },
});
