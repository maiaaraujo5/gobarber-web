import React from 'react'
import {Switch} from 'react-router-dom';

import SignIn from '../pages/Sigin'
import SignUp from "../pages/SigUp";

import Dashboard from "../pages/Dashboard";
import Route from './Route'

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" exact component={SignIn}/>
        <Route path="/signup" component={SignUp}/>

        <Route path="/dashboard" component={Dashboard} isPrivate/>
    </Switch>
)

export default Routes