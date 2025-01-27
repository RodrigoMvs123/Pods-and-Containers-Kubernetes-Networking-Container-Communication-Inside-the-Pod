Pods and Containers Kubernetes Networking Container Communication Inside the Pod

-  https://www.youtube.com/watch?v=5cNrTU6o3Fw 

## Github CLI Command Prompt
Full Example Workflow

#### Navigate to the project folder
> cd ~/Documents/my-new-project

#### Initialize a Git repository
> git init

#### Create README.md file with initial content
> echo "# My New Project" > README.md

#### Stage the file for commit
> git add README.md

#### Commit the file locally
> git commit -m "Add README.md"

#### Create a new GitHub repository and push the changes
> gh repo create my-new-project --public --source=. --push

#### Verify in browser
> gh repo view my-new-project --web

## Kubernetes Network

#### Container Communication 

```
            pod
                my-app
```

> Why is a **Pod abstraction useful** ?

> Container versus Pods

> When are **multiple containers** necessary ?

> How do containers communicate in a Pod ?

Pods - Solving the port allocation problem 

Pod - Fundamental Concept 

> Every Pod has a unique IP address

> IP address reachable from all other Pods in the k8s cluster

Container Port Mapping WITHOUT Pods

> How to allocate ports without getting conflicts 

> Bind host port to application port in container: 5432:5432 

Prompt Command ( Terminal ) 
```
docker run -p 5000:5432 -e POSTGRES_PASSWORD=pwd postgres:9.6.17 
> PostgreSQL init process complete: ready for start up

docker ps
> CONTAINER ID     IMAGE              COMMAND 
  0cf1...          postgres:9.6.17    "docker_entrypoint..."
  CREATED          STATUS           PORTS 
  4 days ago       Up 11 seconds    0.0.0.0:5000->5432/tcp 

docker run -p 5001:5432 -e POSTGRES_PASSWORD=pwd postgres:9.6.17
> Success. You can now start the database server using:
  pg_ctl -D /var/lib/postgresql/data -l logfile start

docker ps 
> CONTAINER ID     IMAGE              COMMAND 
  0cf1...          postgres:9.6.17    "docker_entrypoint..."
  2ce4...          postgres:9.6.17    "docker_entrypoint..."
  CREATED          STATUS           PORTS 
  4 days ago       Up 11 seconds    0.0.0.0:5001->5432/tcp 
  4 days ago       About a minute   0.0.0.0:5000->5432/tcp

```

Problem with container port mapping 

> What ports are still free on the host to bind then 

#### Pod Abstraction 

> own IP address

> usually with one main container 

> containers can talk via localhost and port 

Pod
```
Pod

    Network Namespace 

  postgres
```

- own network namespace 

- virtual ethernet connection 

- pod is a host ( IP Address / range of ports to allocate )

#### Create Pod with Postgres Container

postgres.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: postgres
  labels: 
    app: postgres
spec:
  containers:
  - name: postgres
    image: postgres:9.6.17
    ports:
    - containerPort: 5432
    env:
    - name: POSTGRES_PASSWORD
      value: "pwd"
```

Prompt Command ( Terminal )

```
kubectl apply -f postgres.yaml 
> pod/postgres created 

kubectl get pod
> NAME       READY     STATUS     RESTARTS    AGE
  postgres   1/1       Running    0           11s
```

postgres.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: postgres-2
  labels: 
    app: postgres-2 
spec:
  containers:
  - name: postgres
    image: postgres:9.6.17
    ports:
    - containerPort: 5432
    env:
    - name: POSTGRES_PASSWORD
      value: "pwd"
```

Prompt Command ( Terminal )

```
kubectl apply -f postgres.yaml 
> pod/postgres-2 created 

kubectl get pod
> NAME        READY     STATUS     RESTARTS    AGE
  postgres    1/1       Running    0           11s
  postgres-2  1/1       Running    0           8s 
```

#### Multiple Containers in a Pod

> Helper or side application to your main application 

- Back-up container 

- Authentication 

- Scheduler 

- Synchronising

Pod
```
Pod

    main
         helper 
```

#### How do Containers Communicate Inside the Pod ?

Pod // Isolated Virtual Host 
```
Pod

  Network Namespace 

localhost:9000    localhost:8080
```

- Containers can talk via localhost and port

#### MiniKube Cluster 

nginx-sidecar-container.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx 
  labels:
    app: nginx
spec:
  containers:
  - name: nginx-container
    image: nginx 
    ports:
    - containerPort: 80
  - name: sidecar 
    image: curlimages/curl
    command: ["/bin/sh"]
    args: ["-c", "echo Hello from the sidecar container; sleep 300"]
```

Prompt Command ( Terminal )

```
kubectl apply -f nginx-sidecar-container.yaml
> pod/nginx created

kubectl get pod
> NAME    READY     STATUS    RESTARTS    AGE
  nginx   2/2       Running   0           11s

kubectl exec -it nginx -c sidecar -- /bin/sh 
  \ netstat -ln 
    > Active Internet connections (only servers)
    > Proto Recv-Q Send-Q Local Address   Foreign Address      State
    > tcp        0      0 0.0.0.0:80      0.0.0.0:*            LISTEN
    Active UNIX domain sockets (only servers)
    Proto RefCnt Flags Type State I-Node Path 

  \ curl localhost:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>

  \ exit

kubectl logs nginx -c nginx-container 
> 127.0.0.1 - - [01/Jan/2022:14:00:00 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.78.0" "-"
  127.0.0.1 - - [01/Jan/2022:14:08:00 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.78.0" "-"
  127.0.0.1 - - [01/Jan/2022:14:00:10 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.78.0" "-"
```

#### Pause Container

```
Pod

  Network Namespace 

  main
           pause
```

> "Pause" container in each Pod

> Also called "sand-box" container 

> Reserves and holds network namespace (nets)

> Enables communication between containers in the Pod

- If a container dies and a new one is created the Pod will maintain the same IP address

- If a Pod dies and a new one is created the IP address will change

Command Prompt ( Terminal )

```
echo $(minikube docker-env) 
> export DOCKER_TLS_VERIFY="1"
  export DOCKER_HOST="tcp://192.168.64.5:2376" 
  export DOCKER_CERT_PATH="/Users/Rodrigomvs123/.minikube/certs" 
  # Run this command to configure your shell:
  # eval $(minikube docker-env)

kubectl describe pod nginx
> Name:         nginx
  Namespace:    default
  Priority:     0
  Node:         minikube/192.168.64.5
  Start Time:   Sat, 01 Jan 2022 14:00:00 +0000
  Labels:       app=nginx
  Annotations:  <none>

eval $(minikube docker-env)
docker ps 
> CONTAINER ID     IMAGE              COMMAND 
  0cf1...          nginx:latest       "/docker-entrypoint..."
  2ce4...          curlimages/curl    "/bin/sh -c 'echo H..."
  CREATED          STATUS           PORTS 
  4 days ago       Up 11 seconds

docker ps | grep k8s_POD_nginx
> 2ce4...          k8s_POD_nginx.rodri...   "/pause"
  4 days ago       Up 11 seconds

