---
layout: default
title: Oh My ZSH
parent: Linux & WSL
nav_order: 2
---

This post covers doing this on Ubuntu 20.04 and 22.04 but it should work with any distro that supports running Docker. I say “should” because I didn’t personally try every single distro but there’s nothing about this that would hint it won’t work on other distros.

You’ll get the same conveniences of Docker Desktop such as being able to access `localhost` in your Windows browser of choice to access any web services you run in Docker since this feature is native to WSL 2. Volumes are also lightning fast (comparable to native Linux).

You’ll also have options to run Kubernetes directly in WSL 2 if you choose to use [KinD](https://kind.sigs.k8s.io/) or any other tool that lets you run a Kubernetes cluster without Docker Desktop.

#### Step 1: Uninstall Docker Desktop

Since we’re installing Docker directly inside of WSL 2 you won’t need Docker Desktop installed to make this work.

If you previously had Docker Desktop installed you may also want to delete a few symlinks that Docker adds to WSL 2.

On my machine it added these 2 files in `~/.docker` within my WSL 2 instance:

    lrwxrwxrwx  1 nick nick   30 Sep 16  2020 contexts -> /c/Users/Nick/.docker/contexts
    lrwxrwxrwx  1 nick nick   35 Aug 21 17:24 features.json -> /c/Users/Nick/.docker/features.json
    

Uninstalling Docker Desktop will not remove those Windows paths so things will technically still work but if you ever delete them later you’ll end getting `Docker endpoint for "default" not found` errors when you try to run most Docker commands within WSL 2 since the symlinks will have no destination.

#### Step 2: Install Docker / Docker Compose v2 in WSL 2

Here’s the condensed version for Ubuntu and Debian based distros:

    # Install Docker, you can ignore the warning from Docker about using WSL
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # Add your user to the Docker group
    sudo usermod -aG docker $USER
    
    # Install Docker Compose v2
    sudo apt-get update && sudo apt-get install docker-compose-plugin
    
    # Sanity check that both tools were installed successfully
    docker --version
    docker compose version
    
    # Using Ubuntu 22.04 or Debian 10 / 11? You need to do 1 extra step for iptables
    # compatibility, you'll want to choose option (1) from the prompt to use iptables-legacy.
    sudo update-alternatives --config iptables
    

If you’re using a different distro it’s very similar. Docker has docs for the steps above. These steps came from official Linux installation guides:

*   [https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)
*   [https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)
*   [https://docs.docker.com/compose/install/linux/](https://docs.docker.com/compose/install/linux/)

#### Step 3: Ensure the Docker Service Runs in WSL 2

At the time of this post systemd isn’t started inside of WSL 2 by default.

We won’t need it but **if you decide to [enable systemd](https://learn.microsoft.com/en-us/windows/wsl/wsl-config#systemd-support) with newer versions of WSL 2 then you can skip this entire step!**

All you have to do is drop this into your `~/.profile`, [.zprofile](https://github.com/nickjj/dotfiles/commit/badd3265e5c8f6eca90d3b57df29292545332500) or equivalent file:

    if grep -q "microsoft" /proc/version > /dev/null 2>&1; then
        if service docker status 2>&1 | grep -q "is not running"; then
            wsl.exe --distribution "${WSL_DISTRO_NAME}" --user root \
                --exec /usr/sbin/service docker start > /dev/null 2>&1
        fi
    fi
    

The idea here is the Docker service will get started if it’s not already running. The first time this runs it’ll hang your terminal for a few seconds. However, even if you close your terminal the next time you open it, it will open instantly since Docker will already be running. Closing your terminal will not stop Docker, only rebooting Windows or fully shutting down WSL will.

You can run `ps aux | grep docker` to see the Docker daemon running:

    root  8899  ...  /usr/bin/dockerd -p /var/run/docker.pid
    root  8908  ... containerd --config /var/run/docker/containerd/containerd.toml --log-level info
    

**After opening a new terminal** you should now be able to run `docker run hello-world` successfully without `sudo`. By the way, I have a bunch of [open source web app examples on GitHub](https://github.com/nickjj?tab=repositories&q=docker-*-example) if you want to explore more in depth examples of using Docker.

As a reminder, WSL 2 still has issues around disk space and memory not being reclaimed. This would be an issue with or without Docker Desktop. [This post](/blog/reclaiming-tons-of-diskspace-by-compacting-your-docker-desktop-wsl-2-vm) goes over how to keep your memory and disk space in check.

Also if you’re coming from Docker Desktop and want to investigate your images and volumes on disk you can access them in `cd /var/lib/docker`. You’ll need to be the root user. This is the default spot where Docker saves files on Linux.
