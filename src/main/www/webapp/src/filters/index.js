import Vue from 'vue'
import {dateFilter} from "./dateFilter";

Vue.filter('formatDate', dateFilter.formatDate);
