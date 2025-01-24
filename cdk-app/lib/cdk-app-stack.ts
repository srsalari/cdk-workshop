import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

export class CdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'CdkAppQueue', {
      visibilityTimeout: Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'CdkAppTopic');

    const s3key = new kms.Key(this, 'MyS3Key', {
      enableKeyRotation: true,
      pendingWindow: Duration.days(10), // Default to 30 Days
    });
    

    topic.addSubscription(new subs.SqsSubscription(queue));
    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: "saeed-bucket-cdk-implementation",
      versioned: true,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: s3key,   

    });
  }
  
}
