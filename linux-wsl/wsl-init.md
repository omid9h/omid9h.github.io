---
layout: default
title: Initiate WSL
parent: Linux & WSL
nav_order: 1
published: false
---

# Initiate WSL
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

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
- if usermod wasn't recognized, use it as follows
```bash
/usr/sbin/usermod
```

### Make user default via powershell
assuming your distro is Ubuntu20.04 and user is omid:
```pwershell
ubuntu2004.exe config --default-user omid
```

### make ~ default directory and meanwhile, a python alias :)
edit ```.bashrc``` file and add
```bash
alias python='python3'

# at the end of file to make home default dir
case $PWD/ in
  /mnt/c/Users/*) cd /home/omid/;;
esac
```