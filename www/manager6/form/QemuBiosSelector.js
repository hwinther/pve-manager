Ext.define('PVE.form.QemuBiosSelector', {
    extend: 'Proxmox.form.KVComboBox',
    alias: ['widget.pveQemuBiosSelector'],

    initComponent: function() {
	var me = this;

        me.comboItems = [
	    ['__default__', PVE.Utils.render_qemu_bios('')],
	    ['seabios', PVE.Utils.render_qemu_bios('seabios')],
	    ['ovmf', PVE.Utils.render_qemu_bios('ovmf')],
	    ['openbios-sparc32', 'OpenBIOS (sparc only)'], // TODO: limit choices based on arch/platform
	    ['openbios-sparc64', 'OpenBIOS (sparc64 only)'],
	    ['ss5.bin', 'SS5 PROM (sparc only)'],
	    ['ss10_v2.25_rom', 'SS10 PROM (sparc only)'],
	    ['ss20_v2.25_rom', 'SS20 PROM (sparc only)'],
	];

	me.callParent();
    },
});
