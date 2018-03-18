if [ ! -d "$LOG_FOLDER" ]; then
  export LOG_FOLDER=./logs
fi

sudo docker-compose up >> $LOG_FOLDER/docker_app_`date +%Y-%m-%d`.log &
docker container ls

