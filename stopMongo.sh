echo 'Stopping ' $(ps aux | grep 'mongod\s') >> ./logs/mongo_`date +%Y-%m-%d`.log &
kill -9 $(ps aux | grep 'mongod\s' | awk '{print $2}') &

