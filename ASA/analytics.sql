WITH EnergyInputData AS (
    SELECT 
        Timestamp,
        IoTHub.ConnectionDeviceId AS deviceId,
        GroupName,
        Input1,
        Input2,
        Input3,
        Input4
    FROM  
        CbpiProdIoTHub
    TIMESTAMP BY Timestamp 
    WHERE
        CbpiProdIoTHub.groupname = 'InputData' 
),
EnergyMeasurementData AS (
    SELECT 
        Timestamp,
        IoTHub.ConnectionDeviceId AS DeviceId,
        GroupName,
        TRY_CAST(Value_Voltage_V AS BIGINT) AS Value_Voltage_V,
        TRY_CAST(Value_Curent_A AS FLOAT) AS Value_Curent_A,
        TRY_CAST(Value_Power_W AS BIGINT) AS Value_Power_W,
        TRY_CAST(Value_EnergyTotal_Wh AS BIGINT) AS Value_EnergyTotal_Wh           
    FROM  
        CbpiProdIoTHub
    TIMESTAMP BY Timestamp 
    WHERE
        CbpiProdIoTHub.groupname = 'Measurement' 
)
/* ,
SlumberCalculation AS (
    SELECT          
        BuildingId,
        Sum(TRY_CAST(Value_EnergyTotal_Wh AS BIGINT)) AS SlumberEnergy                  
    FROM
        CbpiProdIoTHub
    TIMESTAMP BY Timestamp
    WHERE
        Groupname = 'Measurement'
        AND
        DatePart(ss, timestamp) < 30      
    GROUP BY TumblingWindow(mi, 10), BuildingId
),
ActiveCalculation AS (
    SELECT          
        BuildingId,
        Sum(TRY_CAST(Value_EnergyTotal_Wh AS BIGINT)) AS ActiveEnergy                  
    FROM
        CbpiProdIoTHub
    TIMESTAMP BY Timestamp
    WHERE
        Groupname = 'Measurement'
        AND
        DatePart(ss, timestamp) > 30      
    GROUP BY TumblingWindow(mi, 10), BuildingId
),
SlumberEnergySummary AS (
    SELECT 
        *
    FROM
        SlumberCalculation SC
    JOIN
        ActiveCalculation AC
    ON
        DateDiff(Minute, SC, AC) BETWEEN 0 and 15
) */

SELECT * INTO CbpiBlobEnergyInputs FROM EnergyInputData
SELECT * INTO CbpiBlobEnergyMeasurements FROM EnergyMeasurementData
SELECT * INTO CbpiSQLEnergyMeasurements FROM EnergyMeasurementData

SELECT * INTO CbpiPBIEnergyInputs FROM EnergyInputData
SELECT * INTO CbpiPBIEnergyMeasurements FROM EnergyMeasurementData
/*SELECT * INTO CbpiBlobSlumberActiveEnergy FROM SlumberEnergySummary*/

 