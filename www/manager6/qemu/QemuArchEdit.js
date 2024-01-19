Ext.define('PVE.form.QemuArchSelector', {
    extend: 'Proxmox.form.KVComboBox',
    alias: ['widget.pveQemuBiosSelector'],

    initComponent: function() {
	var me = this;

        me.comboItems = [
	    ['__default__', 'Default (x86_64)'],
	    ['x86_64', 'x86_64'],
	    ['aarch64', 'aarch64'],
	];

	me.callParent();
    },
});

Ext.define('PVE.qemu.ArchEdit', {
    extend: 'Proxmox.window.Edit',
    alias: 'widget.pveQemuArchEdit',

    onlineHelp: 'qm_options',
    subject: 'Architecture',
    autoLoad: true,

    viewModel: {
	data: {
	    arch: '__default__',
	},
    },

    items: [
	{
	    xtype: 'pveQemuBiosSelector',
	    onlineHelp: 'qm_options',
	    name: 'arch',
	    value: '__default__',
	    bind: '{arch}',
	    fieldLabel: 'ARCH',
	},
    ],
});
