# gis
## 坐标系
### 分类
1. 地理坐标系
    - 4326 WGS84
    - 4490 CGCS2000
2. 投影坐标系
    - 3857 WGS84-web墨卡托
### 正射切片
1. **vue+leaflet加载4490天地图**  
```js
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import "proj4"
import "proj4leaflet"

let crs4490 = new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
        resolutions: [
            1.40625,
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125E-4,
            3.4332275390625E-4,
            1.71661376953125E-4,
            8.58306884765625E-5,
            4.291534423828125E-5,
            2.1457672119140625E-5,
            1.0728836059570312E-5,
            5.364418029785156E-6,
            2.682209064925356E-6,
            1.3411045324626732E-6
        ],
        origin: [-180, 90],
    })
//矢量底图
let vecLayer = L.tileLayer(
    "http://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles"
    + "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" + tk, {
    subdomains: subdomains,
});

//矢量注记
let cvaLayer = L.tileLayer(
    "http://t{s}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles"
    + "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" + tk, {
    subdomains: subdomains,
});

let vecG = L.layerGroup([vecLayer, cvaLayer]);

let map: L.Map;
map = L.map("leaflet", {
    minZoom: 3,
    maxZoom: 18,
    center: [31.33269, 120.606344],
    zoom: 2,
    crs: crs4490,
    layers: [vecG],
    attributionControl: false
});
``` 
2.**leaflet加载4490正射tiles**  
```js{4}
L.tileLayer(
    "http://192.168.8.7:6001/odm/1baa87cf904e6be86c512b039dd692d4/orthophoto_tiles/{z}/{y}/{x}.png",
    {
        zoomOffset: -1,
    }
).addTo(map);
```



## postgis
### sql
将geometry类型的字段直接转换为svg图片，以显示轮廓。  
核心做法:
1. 按最小的x、y坐标负向平移，以实现初始坐标为0
2. 取宽和高中的较大值来进行放大
3. 对svg的viewBox进行平移，以实现轮廓完全接边展示
 
```sql 
SELECT ST_Scale(ST_Translate(geom, -1 * ST_XMin(geom), -1 * ST_YMin(geom))
	, CEIL(GREATEST((ST_XMax(geom)-ST_YMin(geom)),(ST_YMax(geom)-ST_XMin(geom))))
	, CEIL(GREATEST((ST_XMax(geom)-ST_YMin(geom)),(ST_YMax(geom)-ST_XMin(geom))))) AS scale_geom
	, CEIL(GREATEST((ST_XMax(geom)-ST_YMin(geom)),(ST_YMax(geom)-ST_XMin(geom)))) AS sc
FROM region
WHERE geom IS NOT NULL
LIMIT 10
),
p AS (
SELECT ST_AsSvg(scale_geom,0,4) AS svg
,sc,ST_XMin(scale_geom) AS x_min
, ST_YMin(scale_geom) AS y_min
, ST_XMax(scale_geom) AS x_max
, ST_YMax(scale_geom) AS y_max
FROM q
)
SELECT CONCAT('<svg width="300" height="300" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="',
            CONCAT_WS(' ', 0, CEIL(-1*y_max), CEIL(( x_max-x_min)), CEIL(( y_max-y_min)) ), '"> <path d="', svg, '"></path></svg>') AS "svg"
FROM p 
```

## 代码
### Java中的使用MyBatis类型映射 
引用
```xml
<dependency>
    <groupId>com.graphhopper.external</groupId>
    <artifactId>jackson-datatype-jts</artifactId>
</dependency>
```
核心类型如下;其余如LinearRing、Point、Polygon等参照此写法
```java
@MappedTypes(Geometry.class)
public class GeometryTypeHandler extends AbstractGeometryTypeHandler<Geometry> {
}
```
基类`AbstractGeometryTypeHandler`在不同类型的数据库中有不同的实现。
#### Mysql
```java
package com.hoe.data.jts;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ByteOrderValues;
import org.locationtech.jts.io.WKBReader;
import org.locationtech.jts.io.WKBWriter;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

//@MappedTypes(Geometry.class)
public abstract class AbstractGeometryTypeHandler<T extends Geometry> extends BaseTypeHandler<T> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        try {
            ps.setBytes(i,convertGeoToBytes(parameter));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        // 参考https://dev.mysql.com/doc/refman/8.0/en/gis-data-formats.html#gis-internal-format
        return convertBytesToGeo(rs.getBytes(columnName));
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return convertBytesToGeo(rs.getBytes(columnIndex));
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return convertBytesToGeo(cs.getBytes(columnIndex));
    }

    private T convertBytesToGeo(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        try {
            GeometryFactory geometryFactory= new GeometryFactory(new PrecisionModel(), 4326);
            byte[] geomBytes = ByteBuffer.allocate(bytes.length - 4).order(ByteOrder.LITTLE_ENDIAN)
                    .put(bytes, 4, bytes.length - 4).array();
            Geometry geometry = new WKBReader(geometryFactory).read(geomBytes);
            return (T) geometry;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private byte[] convertGeoToBytes(Geometry geometry) throws IOException {
        byte[] geometryBytes = new WKBWriter(2, ByteOrderValues.LITTLE_ENDIAN).write(geometry);
        byte[] wkb = new byte[geometryBytes.length + 4];
        ByteOrderValues.putInt(4326, wkb, ByteOrderValues.LITTLE_ENDIAN);
        System.arraycopy(geometryBytes, 0, wkb, 4, geometryBytes.length);
        return wkb;
    }
}
```

#### Postgresql
```java
package com.hoe.data.jts;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.WKBReader;
import org.locationtech.jts.io.WKBWriter;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

//@MappedTypes(Geometry.class)
public abstract class AbstractGeometryTypeHandler<T extends Geometry> extends BaseTypeHandler<T> {

    private final WKBReader wkbReader = new WKBReader();
    private final WKBWriter wkbWriter = new WKBWriter();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        try {
            ps.setBytes(i, wkbWriter.write(parameter));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) {
        try {
            return (T) wkbReader.read(WKBReader.hexToBytes(rs.getString(columnName)));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) {
        try {
            return (T) wkbReader.read(WKBReader.hexToBytes(rs.getString(columnIndex)));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) {
        try {
            return (T) wkbReader.read(WKBReader.hexToBytes(cs.getString(columnIndex)));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```