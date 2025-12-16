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
### 公共MQTT服务器
#### hivemq
```
Host:	            broker.hivemq.com
TCP Port:	        1883
Websocket Port:	    8000
TLS TCP Port:	    8883
TLS Websocket Port:	8884
```