


- Country-Level Revenue Table (GET /api/revenue-by-country) -> Return Country, Product Name, Total Revenue, Number of Transactions
- Country-Level Revenue Table must sorted by total revenue in descending order
- Top 20 Frequently Purchased Products​ -> current available stock quantity
- chart to highlight the months with the highest sales volume
- Top 30 Regions by Revenue -> top 30 regions with the highest total revenue and items sold using an appropriate chart.

trasnsaction_id, transaction_date, user_id, country, region, product_id, product_name, category, price, quantity, total_price, stock_quantity, added_date

## The Dataset isnt in the repo, so please download and put it in the data folder



## Web

node version: 22

```bash
cd web
npm install
npm run dev
```


# References
 - https://github.com/air-verse/air
 - https://echo.labstack.com/guide/
 - https://github.com/golang-standards/project-layout