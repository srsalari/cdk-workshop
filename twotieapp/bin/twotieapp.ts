#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TwotieappStack } from '../lib/twotieapp-stack';

const app = new cdk.App();
new TwotieappStack(app, 'TwotieappStack');
