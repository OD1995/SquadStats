import { useEffect, useState } from "react"
import { Table } from "../../generic/Table"

interface OwnProps {
    playerData:Record<string,Record<string,string>>
    uniqueMetrics:string[]
}

export const PlayerDataSection = (props:OwnProps) => {
    
    const [headers, setHeaders] = useState<JSX.Element>();
    const [rows, setRows] = useState<JSX.Element[]>([]);

    useEffect(
        () => {
            const metricOrder = getMetricOrder(props.uniqueMetrics);
            setHeaders(getHeaders(["",...metricOrder]));
            var _rows = [];
            for (const [playerId,playerDataDict] of Object.entries(props.playerData)) {
                var vals = [
                    <td><a href={`/player/${playerId}`}>{playerDataDict['player_name']}</a></td>
                ] as JSX.Element[];
                for (const metric of metricOrder) {
                    vals.push(
                        <td>{playerDataDict[metric]}</td>
                    )
                }
                _rows.push(<tr>{vals}</tr>);
            }
            setRows(_rows);
        },
        []
    )

    const getHeaders = (metricOrder:string[]) => {
        return (
            <tr>
                {
                    metricOrder.map(
                        (metric:string) => {
                            return (
                                <th>{metric}</th>
                            )
                        }
                    )
                }
            </tr>
        )
    }

    const getMetricOrder = (metricArray:string[]) => {
        const preferredOrder = [
            'Goals',
            'Assists',
            'Player Of Match'
        ]
        var metricDict = {} as Record<string,boolean>;
        for (const metric of metricArray) {
            if (metric != 'Appearances') {
                metricDict[metric] = false;
            }
        }
        var returnArray = [];
        // Add existing metrics in preferred order
        for (const metric of preferredOrder) {
            if (metric in metricDict) {
                returnArray.push(metric);
                metricDict[metric] = true;
            }
        }
        // Add the rest of the metrics
        for (const metric of Object.keys(metricDict)) {
            if (metricDict[metric] == false) {
                returnArray.push(metric);
            }
        }
        return returnArray;
    }
    
    return (
        // <div>
            <Table
                headers={headers}
                rows={rows}
                className="match-view-player-table"
            />
        // {/* </div> */}
    )
}