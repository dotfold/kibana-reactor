import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

import React from 'react';
import ReactDOM from 'react-dom';

// TODO: file issue & PR against generator repo
console.log('[react]', React);
// chrome
//   .setNavBackground('#222222');

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/reactor/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

// connect to $scope via hoc
const HelloComponent = React.createClass({
  propTypes: {
    fname : React.PropTypes.string.isRequired,
    lname : React.PropTypes.string.isRequired
  },
  render: function () {
    return <span>Hello {this.props.fname} {this.props.lname}</span>;
  }
});

const wire = function wire(module) {
  const controller = module.controller('computedController', function ($scope) {
    console.log('computedController');
  });

  return function wrapWithWiredScope(Wrapped) {
    console.log('wrapWithWiredScope');
    return controller.directive('hello', function () {
      console.log('computedDirective');
      return {
        link: function (scope, element) {
          console.log('linking computedDirective', element);
          // {dispatch: () => {console.log('dispatch()');}
          ReactDOM.render(<div>linked</div>, element[0]);
        }
      };
    });
  };
};

wire(uiModules.get('app/reactor', []))(HelloComponent);





//
//  first pass
//

uiModules
.get('app/reactor', [])
.controller('reactorHelloWorld', function ($scope, $route, $interval) {
  $scope.title = 'Reactor';
  $scope.description = 'lets just use react';

  $scope.fname = 'Mr';
  $scope.lname = 'Lname';

  var currentTime = moment($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  var unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);
});
