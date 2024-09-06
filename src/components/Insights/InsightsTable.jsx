function InsightsTable({data, name}) {
    return (
        <div className="container">
        <div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">{name}</th>
                    <th scope="col">MSPR</th>
                    <th scope="col">Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{fontWeight: 'bold'}}>Total</td>
                    <td>{data.totalMSPR.toFixed(2)}</td>
                    <td>{data.totalChange.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 'bold'}}>Positive</td>
                    <td>{data.posMSPR.toFixed(2)}</td>
                    <td>{data.posChange.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 'bold'}}>Negative</td>
                    <td>{data.negMSPR.toFixed(2)}</td>
                    <td>{data.negChange.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}


export default InsightsTable;