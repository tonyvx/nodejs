echo 'Stopping ' $(ps aux | grep '\snode\s') >> ./logs/node`date +%Y-%m-%d`.log
kill -9 $(ps aux | grep '\snode\s' | awk '{print $2}') &
