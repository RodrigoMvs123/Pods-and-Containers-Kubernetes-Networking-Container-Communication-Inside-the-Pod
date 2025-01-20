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


