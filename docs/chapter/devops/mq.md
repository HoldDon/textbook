## RabbitMq
``` 
 rabbitmq-plugins list
 rabbitmqctl trace_on
 rabbitmq-plugins enable rabbitmq_tracing
```

## MQTT
### mosquitto
```bash 
# 订阅
mosquitto_sub.exe -L "mqtt://hgyq:25_gv#F9@122.193.105.34:1883//PUSH/+/DPUT/upload"
# 发布
mosquitto_pub.exe -L "mqtt://hgyq:25_gv#F9@122.193.105.34:1883/cst/sensor/23232"  -m "233" 
```