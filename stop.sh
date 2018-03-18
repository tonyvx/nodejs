echo 'Stopping docker' >> ./logs/docker_app_`date +%Y-%m-%d`.log
sudo docker-compose down >> ./logs/docker_app_`date +%Y-%m-%d`.log &
