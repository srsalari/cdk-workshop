import { Duration, Stack, StackProps } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
// import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class TwotieappStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const queue = new sqs.Queue(this, 'TwotieappQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });

    // const topic = new sns.Topic(this, 'TwotieappTopic');

    // topic.addSubscription(new subs.SqsSubscription(queue));

    const customVpc = new ec2.Vpc(this, 'CustomVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.30.0.0/16'),
      createInternetGateway: true,
    });

    const publicSubnet1 = new ec2.PublicSubnet(this, 'MyPublicSubnet1', {
      availabilityZone: 'us-east-1a',
      cidrBlock: '10.30.1.0/24',
      vpcId: customVpc.vpcId,
    
      // the properties below are optional
      mapPublicIpOnLaunch: true,
       
    });

    const publicSubnet2 = new ec2.PublicSubnet(this, 'MyPublicSubnet2', {
      availabilityZone: 'us-east-1b',
      cidrBlock: '10.30.2.0/24',
      vpcId: customVpc.vpcId,
    
      // the properties below are optional
      mapPublicIpOnLaunch: true,
       
    });
    const ec2SecurityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', { 
      vpc: customVpc,});

    // instance to add as the target for load balancer.
    const ec2Instance = new ec2.Instance(this, 'MyEC2Instance', {
      vpc: customVpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      securityGroup: ec2SecurityGroup, 
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
        // subnets: [publicSubnet1],
      },
    });
      ec2SecurityGroup.addIngressRule(
        ec2.Peer.ipv4("0.0.0.0/0"), 
        ec2.Port.tcp(22),
      );

      ec2SecurityGroup.addIngressRule(
        ec2.Peer.ipv4("0.0.0.0/0"), 
        ec2.Port.tcp(80),
      );

      ec2SecurityGroup.addIngressRule(
        ec2.Peer.ipv4("0.0.0.0/0"), 
        ec2.Port.tcp(443),
      );
    
      const ec2SecurityGroup2 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup2', { 
        groupDescription: 'SG Description',
        vpcId: customVpc.vpcId,
        groupName: 'PublicEC2-SG-2',
        securityGroupIngress: [
          {
            ipProtocol: 'tcp',
            cidrIp: '0.0.0.0/0',
            description: 'Rule-1',
            fromPort: 80,
            toPort: 80,
          },
          {
            ipProtocol: 'tcp',
            cidrIp: '0.0.0.0/0',
            description: 'Rule-1',
            fromPort: 22,
            toPort: 22,
          },
          {
            ipProtocol: 'tcp',
            cidrIp: '0.0.0.0/0',
            description: 'Rule-1',
            fromPort: 443,
            toPort: 443,
          }
        ]
  
      });
  }
}
