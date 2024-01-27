Ext.define('PVE.form.NetworkCardSelector', {
    extend: 'Proxmox.form.KVComboBox',
    alias: 'widget.pveNetworkCardSelector',
    comboItems: [
	['e1000', 'Intel E1000'],
	['virtio', 'VirtIO (' + gettext('paravirtualized') + ')'],
	['rtl8139', 'Realtek RTL8139'],
	['vmxnet3', 'VMware vmxnet3'],
	["ne2k_pci", "RTL8029 NE2000 PCI"],
	['pcnet', 'AMD PCnet FAST'],
	['sunhme', 'Sun Happy Meal (sparc64 only)'],
    ],
});
