import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Index from './views/Index'
import activityConfig from './views/activity/config/Index'
import activityData from './views/activity/data/Index'


module.exports = (
  <Route path="/businiss/bsm" component={Index}>
    <IndexRoute component={activityConfig}/>
    <Route path="activity/activityData/:id" component={activityData}></Route>
  </Route>
)