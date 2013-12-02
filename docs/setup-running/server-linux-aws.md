# server setup

## AWS (Amazon Web Services) setup
Since it can be tricky.. Digital Ocean and Rackspace are much simpler!

1. create new (EC2) instance
	- Ubuntu (most recent - 12.04, 64bit)
2. Create or use existing keypair. SSH public key will be generated and private key (as .pem file) will be available for download. We'll use this for SSH access later.
3. Create or use existing security group
	1. open ports
		- 22 for SSH
		- 80 for HTTP
		- any other needed ports: 3000-3100 for node and socket
4. Create elastic IP and associate with instance
5. Use keypair (.pem file) to setup public key authentication to be able to SSH into the instance.
	-  For Ubuntu, the "username" is "ubuntu" (other forums say "root" or "ec2-user" but those don't work for Ubuntu at least)
	- WINDOWS
		- navigate to ~/.ssh folder and create a new file (i.e. id_rsa.[project_name]) and paste the private key info downloaded from AWS (the .pem file contents) into it
		- open the "config" file in the ~/.ssh folder (or create it if it doesn't exist) and then add lines:
			Host *[elastic ip address]*
				IdentityFile ~/.ssh/id_rsa.[project_name]
		- Connect (via git bash - cygwin doesn't seem to work)
			ssh ubuntu@[elastic ip address]
6. SSH in (i.e. ssh ubuntu@[elastic ip]) then set up Ubuntu as normal (see guide below)
7. set up additional (non-root) users
	- public key authentication (recommended way over password authentication)
		http://utkarshsengar.com/2011/01/manage-multiple-accounts-on-1-amazon-ec2-instance/
8. SES (email)
	1. need an access key id & secret)
		- http://aws.amazon.com/iam/
	2. may need to synchronize system clock with amazon clock (UTC) if it doesn't work
		- sudo /usr/sbin/ntpdate 0.north-america.pool.ntp.org 1.north-america.pool.ntp.org 2.north-america.pool.ntp.org 3.north-america.pool.ntp.org
		- http://www.mindgeek.net/amazon-ws/amazon-ses-request-expired-it-must-be-within-300secsof-server-time/
	3. need to request "production access" and add verified "from" email addresses. In sandbox mode, need to also verify "to" email addresses.