/* @ngInject */
function giftCodeModal($rootScope, gettextCatalog, notification, paymentModel, pmModal) {
    const I18N = {
        success: gettextCatalog.getString('Code applied', null, 'Success')
    };
    return pmModal({
        controllerAs: 'ctrl',
        templateUrl: require('../../../templates/payment/giftCodeModal.tpl.html'),
        /* @ngInject */
        controller: function(params) {
            const unsubscribe = $rootScope.$on('payments', (e, { type }) => {
                if (type === 'giftCode.success') {
                    params.close();
                }
            });

            this.submit = () => {
                paymentModel.useGiftCode(this.giftCode).then(() => {
                    notification.success(I18N.success);
                    params.close();
                });
            };
            this.close = params.close;
            this.$onDestroy = () => unsubscribe();
        }
    });
}
export default giftCodeModal;
