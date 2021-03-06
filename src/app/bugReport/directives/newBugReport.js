/* @ngInject */
const newBugReport = ($rootScope) => ({
    replace: true,
    templateUrl: require('../../../templates/bugReport/newBugReport.tpl.html'),
    link(scope, el) {
        const onClick = () => {
            $rootScope.$emit('bugReport', {
                type: 'new',
                data: {}
            });
        };
        el.on('click', onClick);

        scope.$on('$destroy', () => {
            el.off('click', onClick);
        });
    }
});
export default newBugReport;
