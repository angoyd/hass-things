# TibberCard

Small lovelace card to display electicity price from Tibber, for today and tomorrow.

Create an restsensor as below. Replace <token> with a token from tibber developer portal. https://developer.tibber.com/

```yaml
  - platform: rest
    name: Tibber Price
    resource: https://api.tibber.com/v1-beta/gql
    method: POST
    payload: '{ "query": "{viewer {homes {currentSubscription {priceInfo {today {total} tomorrow {total}}}}}}"}'
    headers:
      Authorization: "Bearer <token>"
      User-Agent: Home Assistant
      Content-Type: application/json
    json_attributes_path: "$.data.viewer.homes[0].currentSubscription.priceInfo"
    json_attributes:
      - today
      - tomorrow
    scan_interval: 14400
    value_template: 'OK'
```
