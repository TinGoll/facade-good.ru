export const ORDER_PDF_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>{{header.title}}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Roboto:wght@100;400;500&family=Rubik:wght@300;400;500&display=swap"
      rel="stylesheet"
    />
    <style>
    body {
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      line-height: 100%;
      font-family: 'Roboto';
    }

    img {
      outline: none;
      text-decoration: none;
      border: none;
      -ms-interpolation-mode: bicubic;
      max-width: 100% !important;
      margin: 0;
      padding: 0;
      display: block;
    }

    .mail {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px;
    }

    .mail span {
      color: black;
    }

    .title {
      background-color: #f0ebef;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: stretch;
    }
    .title div {
      flex: 1;
      padding: 16px;
      text-align: center;
      border-bottom: 1px solid #dedede;
      border-top: 1px solid #dedede;
      border-left: 1px solid #dedede;
    }

    .title div:last-child {
      border-right: 1px solid #dedede;
    }

    .header {
    }

    .header_row {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      border-top: 1px solid #dedede;
      border-right: 1px solid #dedede;
    }

    .header_row:last-child {
      border-bottom: 1px solid #dedede;
    }

    .header_row div {
      flex: 1;
      text-align: left;
      padding: 8px;
      padding-left: 24px;
      color: grey;
      border-left: 1px solid #dedede;
    }

    .header_row_solid .header_row div span {
      font-weight: 500;
      color: black;
    }

    .order_body {
    }
    .order_table {
      width: 100%;
      border-collapse: collapse;
    }

    .order_table thead tr {
      background-color: #f0ebef;
    }
    .order_table thead tr th {
      border: 1px solid #dedede;
      padding: 8px;
      font-size: 15px;
    }

    .order_table tbody tr {
      border-left: 1px solid #dedede;
      border-bottom: 1px solid #dedede;
    }

    .order_table tbody td {
      padding: 6px;
      font-size: 15px;
      border-right: 1px solid #dedede;
    }

    .th_num {
      width: 30px;
      font-weight: 400;
    }
    .th_height {
      width: 60px;
    }
    .th_width {
      width: 60px;
    }
    .th_amount {
      width: 55px;
    }
    .th_type {
      width: 100px;
    }

    .th_model {
      width: 130px;
    }

    .txt_left {
      text-align: left;
    }

    .txt_center {
      text-align: center;
    }
    .table-title {
      text-align: center;
      padding: 8px;
      border: 1px solid #dedede;
      font-weight: 500;
      font-size: 1.1em;
    }
    </style>
  </head>
  <body>
    <div class="mail">
      <div class="title">
        <div>{{header.title}}</div>
        <div>{{header.phone}}</div>
        <div>{{header.mail}}</div>
      </div>
      <div class="header">
        <div class="header_row">
          <div>Материал: <span>{{header.material}}</span></div>
          <div>Модель: <span>{{header.model}}</span></div>
          <div>Цвет: <span>{{header.color}}</span></div>
        </div>
        <div class="header_row">
          <div>Блеск: <span>{{header.glossiness}}</span></div>
          <div>Патина: <span>{{header.patina}}</span></div>
          <div>Присадка: <span>{{header.drill}}</span></div>
        </div>
        <div class="header_row">
          <div>Термошов: <span>{{header.thermalseam}}</span></div>
          <div>Накат: <span>{{header.roll}}</span></div>
          <div></div>
        </div>
        <div class="header_row">
          <div>
            <span>
             {{header.note}}
            </span>
          </div>
        </div>
      </div>
      {{#if facades.length}}
      <div class="order_body">
      <div class="table-title">Фасады</div>
        <table class="order_table">
          <thead>
            <tr>
              <th class="th_num">№</th>
              <th class="th_height">Высота</th>
              <th class="th_width">Ширина</th>
              <th class="th_amount">Кол-во</th>
              <th class="th_type">Вид</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
              {{#each facades}}
              <tr>
                <td class="txt_center">{{num}}</td>
                <td class="txt_center">{{height}}</td>
                <td class="txt_center">{{width}}</td>
                <td class="txt_center">{{amount}}</td>
                <td class="txt_center">{{type}}</td>
                <td class="txt_left">{{note}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </div>
      {{/if}}
      {{#if accessories.length}}
      <div>
      <div class="table-title">Комплектующие</div>
        <table class="order_table">
          <thead>
            <th class="th_num">№</th>
            <th class="th_type">Вид</th>
            <th class="th_model">Модель</th>
            <th class="th_height">Длин.</th>
            <th class="th_amount">Кол-во</th>
            <th>Комент</th>
          </thead>
          <tbody>
             {{#each accessories}}
              <tr>
                <td class="txt_center">{{num}}</td>
                <td class="txt_center">{{type}}</td>
                <td class="txt_center">{{model}}</td>
                <td class="txt_center">{{height}}</td>
                <td class="txt_center">{{amount}}</td>
                <td>{{note}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </div>
      {{/if}}
    </div>
  </body>
</html>
`;
