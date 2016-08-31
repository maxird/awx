/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import listController from './dashboard-hosts-list.controller';
import editController from './dashboard-hosts-edit.controller';

var dashboardHostsList =  {
    name: 'dashboardHosts',
    url: '/home/hosts?:active-failures',
    controller: listController,
    templateUrl: templateUrl('dashboard/hosts/dashboard-hosts-list'),
    data: {
        activityStream: true,
        activityStreamTarget: 'host'
    },
    ncyBreadcrumb: {
        parent: 'dashboard',
        label: "HOSTS"
    },
    resolve: {
        hosts: ['Rest', 'GetBasePath', '$stateParams', function(Rest, GetBasePath, $stateParams){
            var defaultUrl = GetBasePath('hosts') + '?page_size=10' + ($stateParams['active-failures'] ? '&has_active_failures=true' : '' );
            Rest.setUrl(defaultUrl);
            return Rest.get().then(function(res){
                var results = _.map(res.data.results, function(value){
                    value.inventory_name = value.summary_fields.inventory.name;
                    value.inventory_id = value.summary_fields.inventory.id;
                    return value;
                });
                res.data.results = results;
                return res.data;
            });
        }]
    }
};

var dashboardHostsEdit = {
    name: 'dashboardHosts.edit',
    url: '/:id',
    controller: editController,
    templateUrl: templateUrl('dashboard/hosts/dashboard-hosts-edit'),
    ncyBreadcrumb: {
        parent: 'dashboardHosts',
        label: "{{host.name}}"
    },
    resolve: {
        host: ['$stateParams', 'Rest', 'GetBasePath', function($stateParams, Rest, GetBasePath){
            var defaultUrl = GetBasePath('hosts') + '?id=' + $stateParams.id;
            Rest.setUrl(defaultUrl);
            return Rest.get().then(function(res){
                return res.data.results[0];
            });
        }]
    }
};

export {dashboardHostsList, dashboardHostsEdit};