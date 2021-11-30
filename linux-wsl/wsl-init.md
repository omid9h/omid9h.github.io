---
layout: default
title: Initiate WSL
parent: Linux & WSL
nav_order: 1
---

# Initiate WSL
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Enable Version 2
1. Enable WSL
```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```
2. Enable ‘Virtual Machine Platform’
```
# in Windows 10 (2004)
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
# in Windows 10 (1903, 1909)
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```
3. Set WSL 2 as default
```
wsl --set-default-version 2
```
4. Install a distro (or import one)

## Installation
Several distros are available in **Microsoft Store**. I recommend using **Ubuntu20.04**. If installing through store was not available,  download AppxBundle from store using 
[this service](https://store.rg-adguard.net/)
and then install it via PowerShell
```powershell
Add-AppxPackage -Path "C:\Path\to\File.Appx"
```

## Add user
```bash
adduser omid
usermod -aG sudo omid
```

**[Hint]** if usermod wasn't recognized, use it as follows
```bash
/usr/sbin/usermod
```

### Make user default via powershell
assuming your distro is Ubuntu20.04 and user is omid:
```pwershell
ubuntu2004.exe config --default-user omid
```

### Make ~ default directory and meanwhile, add a python alias :)
edit ```.bashrc``` file and add
```bash
alias python='python3'

# at the end of file to make home default dir
case $PWD/ in
  /mnt/c/Users/*) cd /home/omid/;;
esac
```

## Install Packages
```bash
sudo apt update && sudo apt upgrade
sudo apt install net-tools # for ifconfig or just use: ip address
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl
```

## Creating the PostgreSQL Database and User
```bash
sudo /etc/init.d/postgresql restart

sudo -u postgres psql

CREATE DATABASE <DB_NAME>;
CREATE USER <USER_NAME> WITH PASSWORD '<PASSWORD>';

ALTER ROLE <USER_NAME> SET client_encoding TO 'utf8';
ALTER ROLE <USER_NAME> SET default_transaction_isolation TO 'read committed';
ALTER ROLE <USER_NAME> SET timezone TO 'UTC';

ALTER USER <USER_NAME> WITH SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE <DB_NAME> TO <USER_NAME>;

\q
```

## Python packages
```bash
sudo -H pip3 install --upgrade pip

sudo apt-get install python3-venv

python -m venv env
source env/bin/activate
pip install django psycopg2-binary
```

## Installation of pgadmin
I've used [this DigitalOcean document](https://www.digitalocean.com/community/tutorials/how-to-install-configure-pgadmin4-server-mode).

```bash
sudo apt install libgmp3-dev libpq-dev libapache2-mod-wsgi-py3

sudo mkdir -p /var/lib/pgadmin4/sessions
sudo mkdir /var/lib/pgadmin4/storage
sudo mkdir /var/log/pgadmin4

sudo chown -R omid:omid /var/lib/pgadmin4
sudo chown -R omid:omid /var/log/pgadmin4
```

create a directory for pgadmin and an env inside it

```bash
source env/bin/activate

wget https://ftp.postgresql.org/pub/pgadmin/pgadmin4/v5.1/pip/pgadmin4-5.1-py3-none-any.whl
python -m pip install wheel
python -m pip install pgadmin4-5.1-py3-none-any.whl

vim env/lib/python3.8/site-packages/pgadmin4/config_local.py
LOG_FILE = '/var/log/pgadmin4/pgadmin4.log'
SQLITE_PATH = '/var/lib/pgadmin4/pgadmin4.db'
SESSION_DB_PATH = '/var/lib/pgadmin4/sessions'
STORAGE_DIR = '/var/lib/pgadmin4/storage'
SERVER_MODE = True

python env/lib/python3.8/site-packages/pgadmin4/setup.py

deactivate

sudo chown -R www-data:www-data /var/lib/pgadmin4/
sudo chown -R www-data:www-data /var/log/pgadmin4/

sudo apt install apache2

sudo vim /etc/apache2/sites-available/pgadmin4.conf
<VirtualHost *>
    ServerName 172.28.128.254

    WSGIDaemonProcess pgadmin processes=1 threads=25 python-home=/home/omid/pgadmin/env
    WSGIScriptAlias / /home/omid/pgadmin/env/lib/python3.8/site-packages/pgadmin4/pgAdmin4.wsgi

    <Directory "/home/omid/pgadmin/env/lib/python3.8/site-packages/pgadmin4/">
        WSGIProcessGroup pgadmin
        WSGIApplicationGroup %{GLOBAL}
        Require all granted
    </Directory>
</VirtualHost>


sudo a2dissite 000-default.conf
sudo  service apache2 restart
# if needed
sudo a2enmod wsgi
sudo a2ensite pgadmin4.conf
```

and then open [http://localhost/browser/](http://localhost/browser/)

**[Hint]** you can check listening ports by
```bash
ss -nlt
```
