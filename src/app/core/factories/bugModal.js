import _ from 'lodash';

/* @ngInject */
function bugModal(pmModal) {
    return pmModal({
        controllerAs: 'ctrl',
        templateUrl: require('../../../templates/modals/bug.tpl.html'),
        /* @ngInject */
        controller: function(params) {
            this.form = {
                ...params.form,
                Description: `${params.form.Description || ''}\n\n\n ${params.content || ''}`
            };

            this.form.attachScreenshot = false; // Do not attach screenshot by default
            this.submit = () => (params.submit || _.noop)(this.form);
            this.cancel = params.cancel;
        }
    });
}
export default bugModal;
