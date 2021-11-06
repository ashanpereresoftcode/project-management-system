import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import 'jspdf-autotable'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  // logo: string = `../../../assets/ashan.jpg`;
  logo: string = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QB+RXhpZgAASUkqAAgAAAACADEBAgAHAAAAJgAAAGmHBAABAAAALgAAAAAAAABHb29nbGUAAAMAAJAHAAQAAAAwMjIwAaADAAEAAAABAAAABaAEAAEAAABYAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAP/bAIQAAwICCAgICAoICggICAoKCAkICgoICAgICAgICAgICAgICAgICAgICAgICAgICggICAgKCgkICAsNCggNCAgKCAEDBAQGBQYKBgYKDQ0KDQ0NDQ0PDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0N/8AAEQgAjACMAwERAAIRAQMRAf/EAB0AAAICAwEBAQAAAAAAAAAAAAAGBQcDBAgCAQn/xAA6EAABAwIDBgQFAQgCAwEAAAABAAIRAyEEBTEGEkFRYXEHIoGREzKhsdHBCBRSYnKy4fAWQiOC8RX/xAAbAQACAwEBAQAAAAAAAAAAAAAAAwIEBQEGB//EACgRAAICAgMAAgICAQUAAAAAAAABAhEDIQQSMUFREyIyYXEUUoGRsf/aAAwDAQACEQMRAD8A/U1VCAIAEACABAAgAQAIAEAYcS6y4xeV6PorAAEkBCZJNJWyBzDbzD0zE75/lgj30TFFsrS5MY69M+C2zw7xO+Gnk4wVFqSJxzwatuiapVQQCDIOh5rhYTTVo9IAEACABAAgAQAIAEACABAAgAQAIAX9sNqqeFplzruiw/U9Fyr8EZZKKKDzrxGq1XOLnmDwmGxwEaQrscSSM1/sQLtrP9lNoj1PdLaxp4z2n7rnUOg37M+JhpkFryWiJaSSPXukyxWycZuDtF27L7V08UyW2cPmbMx1HMKvKLi9mljyKZNqI4EACABAAgAQAIAEACABAAgCOzvNhSYTx4fk9Ee6E5cnRHP+2+bPrbznmGXJJ1dFgG9B7CVZglEzezm7ZTOd52ZMenAKwvBqgQJzzmZ+ynQxwMv/ACQaNM/Qe83+i7Rz8ZMZLm5nW6Owpw+y3/DbxAGHqAmCCN1w0seXUapGSDn4RhP8bs6Ry/Htqsa9hlrhIVI1YyUlaNhcJAgAQAIAEACABAAgAQAFcbo6V9t1iJ8pMAmOp5NA5cymR+zHyPtKiodqsC54Ib5RpA6c4190mWZRLmLB22V3W8PC4+aT/vJKfOa8NTHx0LGc7AOaTugynQ5/+4ZLjJixicvew+aR6T+Vfx8iMhEsEvhBTzZzLA35xZWdS2U542n4NGz2dGxN/wBPYrvhQywZ1N4D7UhzDTe+9txvDrB56WVDPGnaGcaVOmXGq5pAg4CABAAgAQAIAEACAMeIqQ0nkCVxnJOk2VVWpnEYi+gkn9Pz3XJy6ozcUbdsiM+wzQ4gf/Vj5ZWbeCOiDfQBKpdqNFI08ZlrTMo7MbRD4vYWlU1EqSzSj4dohsz8KqMHdbf7/wC9Fbhy5r5ETgm/Ctc3yV+GqDXcJ9u63+PyFkVfJlcnBStFo+FlVxqM0aJF50E3Pf0Ks5XoxJR2df0RYcbD1VBGwvD2ugCABAAgAQAIAEACANHPHRSqdigVl/gxL2XwNqtQ2AsD9Sf0VfKytiWhTznH0nPMPaexCyMlm3g0iPeBwVRmkqMJoFLkzp6w9Bcsk6MWPpQOa7bsg0Im2GDa5jpC0+LNqSKuVfq7NTw4s9kDjb3Aheku0eYyJXo7KoCw7BVUaS8Pa6AIAEACABAAgAQAIA085ZNKp/SVyRDJ/FiTm2HP7oGgxvbznwYtJ48tFTzTF4Y2kUFtds410mk/df0dqeo5qrHM/GtGxHEiH2T2oqUzu1HEmYMkn1uk54p7RchFpUPlHadt5Kzmix0FnaLxbZh9BvHvHurGPjuZGSohsu/aBo1HQ+m8dbEforUuFJbtCHIZ8e1uIoOdRMhzTHOeXQpeK4TVlbI9GbwRyM1MRTB0Bk9mmT+F6Vv9Tz7jc6OrUouggAQAIAEACABAAgAQBA7XZg5jAG6uMH+nj76JWSVA42hR22a4U90OawBjQJaHyYn5SQDfnI6Kpkkk9nIxvSOc8/yjFb/zjdiHSxjg4zdzRuQ23C8HiVCOXHXhqLHKvRa/4+9tWeo3YcSSJ0cCAAY/ht0CXkypxLmOLsfs+yhtPDl4BDiAPosqErlRcV2UdnO/TqDeHxHOghvmJubCGtcfotuEU1oVOasl8r26w24GltIOJLd2HtcSCA6PiUqYJBNwHT0uoy4+VO1dC1OLLV8KXtc4tYfI+CBexBg24dbApE7vZQzV6i3fA3Jx8bEPizCWju5xn6Ba8dpGOl+1lzqY0EACABAAgAQAIAEACAF3bKkd1hHAx7x+FXzIkmQu2eGaYDoP4WXnY7jJtsrLPMnoNBcfuY9gYWcpN+GzBEPh8g3ngxujW4jRclJjrok9qsr36BbZJhadkoy2VbitlvisiJcLcIP+e6vRzNDJRQrY3w2Djek5p0MMHmBMkFzSJBgTJVqPLcdJiHiQ/eGOzn7vXpxvNE/K4kx2JJ+5XXm7+mbmjUS/fBp5BrsiBIf3Jm/29lpYXZnyh1Sf2WcrIsEACABAAgAQAIAEACANLOGgsM3u0jvISsr/AFArLbvPIcTyF/RYeXZe42ip80xzq0SSGghzRzgyJ/CTSiqNiNGrjPEssfFVkN4kGY6xAPoJS/xtq0SUTLnfiph2tY29QuvDRvW4kwCAO8BRjim0O6IX8Ttqys5rsOx7S0+YlrmAjlcAO9JR+Nr+Q1Q+xqy7aRj6c2nil9KYqUNm1lOIa57XDUHTsJVvCvsy+St0Xd4U5SWYffd8z/7RIH1lbuBasypytjqrIoFJACiAIAEACABAAgAQB5q0wRBUZK0dKZ23wkuqtPM/ULzuV0zSwLRQ2eZlVoVz5S+idwGDBYDYkWggameAKalGUd+l+MWT2Z7I4lxE0Hubul4LQHyxtnO8pNh7qrFpfJYhOPy0RGMyplNo+IypTJEtmk9oI4EGPMPXVNUvobXZ6EjH7Y0qTiN8TcAEwSfWE5YpT+B20jxs/tA4vO5Ja+d7kCB836ciieNL0gptss7YnGy9gdoNernWH3XIpIyuSm7OvcsaBTZA3RutgcraLch4YbNlTOHwvUXOgPqkAIAEACABAAgAQBhxOMYwS9zWjSXODRPK5F+i45Jekkm/CovEjMqLsQWU3h1Tca57QRx0I52gmNJHNYPLiu3aJpceLStlftygOB3hedfsqCkzUTonMh22dQO6HNs3cDXh27uzMsIIAJJuTPJRSJT48cu/H/Rn2s8UXsptqbmHMQBc1HGDMNHlLfZwBupqFkMfEinXZnPG0mRuxdQ1azWtHmLW7ob8xk2jidSbmBJ0VxZuiqJfUFFdUbGEwtOkwMYADaew4DolKUpO2RcaOlP2dth9yk7EVG/ON2lI/wCoMueOhIgHoVq8bG67M87zMlvqi61omaC6dMdQKtk9Oo+sqJqkiK2eg5S7ID7K6AIAw4zGNptLnkNaLknQBRlJRWyUYuTpChW8UqO9DWucP4j5R3AufoFTfLSL8eFNq3Qv7W+N7KTSKTZfHzOndaewneI5SI5FR/1Ll4Nhwm3+xT+Q7U1cVii/EVHPJlrAZhoMufuyIaTTa5tgIBOkykTk2ai48YrSEattoW5zRe42e6rTPKHUnhsdiGgKTinjYZMf6pFs08yZVbvMIBFnDkfwefdYclWxSTWmLGeZZWN2HtouxkmXItGrQyyo1vnib/8AUe8rre9DELmf1g0EuNhpfUqUVbGIrnMdqGMbVqkghgsP43kgNbY2G8RPGFp48VtRF5LWkdmfs9+K9LE4DDsrPaysJptB8rXhsFoadJAIAaYJi0q/iyKP6M8/y+NJScorRcat2jLBAAQoNHUeDRCOkfog1ZidgG9R6lLeGL+/+yPRAzBwDDne8x2kFcWKvGySVETn+0jMO253nRYW9zokZM3TxlzFgeR/0VRtJt46q2oCbeUjlYn/AAqLySl6beLjRhtIRzmJPa3PT30/26VIvfjFTbnabcb10A6/5T8abGxhoTsizh7MbhackkU8RVq/1OouAb2aHBvorFLo3/hHGr9EHxCzY0sVh36RWB/uB06J+KPbHJf0RzKki2cBnzhD2OjeHpfndeel7TOOCZhx+3WKpmYDmzMtIuOx/JUoRizqxmlmHjYYux5dEQBF/t9UyPHv5JLHRWmf7T18U4l/kYNGN4D+Z03PYD1VyMIw89HKNCJtzm+6yjRbq+owns0zp3hafGjbcn8L/wBK+VW0l9l0bA7W/u+GptcGkOqDWYaQwx5gQWkk2dIuqOaPaTZaULZa2XbZVMYwsZicRSrMGnxX77QBaQC0VqfJzQKjf5wIVfs4+sz83ChdpDl+z7meN/8A06lLFPrPaKD3t3qr303jfaA+mXEhw1E2IMggEEK3x5XL0w+ViUKpHSxK0rRln1dAEAauZ44U2OceASc0+sbG449pUc/bW7TOqPcZ4+n3WHbbPSYcaSErFY8yRzDhx1EO9rclNF+EdGjSxkNnSwJ5acSfpMeqlJXob1Eariv3iuXmTTp3EixI0nSxN9NAOaf/ABVDFGiA2UxBqZpUdwFKp01gG/rzTcmsX/JzrsUPG/BkfCcBpUbfvNjHsn8RqmhOdef5JrYraQ7gY7lbt1WPnhTs7DyhpqY21rdOB9D9wqSeyykKGY0y4kuuelh2j8lW4zSBEfjajabSTEweybG5MGVVRnE43ePy0x3uf15DstyL/Hjr5YiEXOd/BYmaYssGGEwN6oeujdZt6EGdFUirsvKH2Tey+07qdVr+LYFtIHOPMB23+0aV8mNNHZR0dFeFvjLTpVA4OMH5muAc0h0SWvbJbMDzRwvMKlFyxSujK5fD/NE6nyfaGjXptfTc0tP8wseVjHstqGWMlao8fkwyxy6yRLKyIBAFe+K+fblF7Qb7t/VwH2+6yOTO5UjT4mO32OfcwzMOA629P95FVY3Z6GERfdijvsHV2vEbrkz+y5FaIbaLHkD4bfmdr0aImR109UyCXpMxfBbTpAD5jfkfrbou9iYs7M4tlDFPqVHbrS14m5vbg0Ez6cFPLcoqjtGbaLH0MVTc6m4VGt3muMFrQ5wuHhwFwCTGtweSIJxZyr0KWzuEiCNRbuBb6qpyG7oRVWhyaTAI9QqFpDlVETnlctE2+iZCmcK12txp3SZt+p0Hc6AcVq4IqyEmZ9kNnDRpy/53kuceROjfQCOHFWpzt0WcWPqjWzfHfFrEA+RnlHfVx+w9FKKpDkSmTVDbh7QeqrzG19jrhMWGwQHNdrbTvFvdpExdVWr9I9ExvyvxPrUmbrd6NbbsSdf+7f7R+qqShv0RLjKTs/QdenPmZ5qvgE8r+yhOVIklZz14hZp8WrVbPzSG9xBHuRHqvOuVyPT8eCUUUzUxx8zTq3S9xwT6NSKNM4uXtPDdc4+gH5hSq0OSIzLv/LUc86TIHTgOOv4THpUMo2MW/wA0TbQ3+lp4qSR0ghgprtHG5JPYn7/oozbHRetkAM0pXwlU/CO+5zHwIeS7eLSRBBPyiTBtfRqfv+RCvlG09gp1G6AOtGglvuLjqbqnmjatEMkfkmviWkLKlF2KTVC/nOJadTflqfYT+is48bJxi5CliMidWxFIuIFGn5yzdM74+TfdMWHm3YsYuZEa2KscGl6T/D+12SW0GPbSpuPEAxpc8LzrMWKIK3oeJuUYbgddT1m8qxNpE4on8vbB4dLGR34drhV5PYz0YsJUABdUJDRfpA/P3tKrzk/ESdIx1M9qfx/D5NDGmBw3jxdz4fcixtkk0fqYts+SELtfiSyg4jWw9Cbqjy3US1x4pzVnOW0zyXkyQdbcwsU9Ri1SKo2xdu1mvHzFxB5EWNx6q5j8L8VRCtxJJqDk17RwsazUzyhsfSWwNPdp24zy4QBwhQfoyXp8qU7+g+old7M6vCMyPEE4h+nlaYtzhckMS0JHiJhGucCdefe5VvGyNUjEzFOfhC5xlzS5gJ1hrAQT/NwnkAitnX9HnZvMH1WgOcYsIFtVXeKN2GOCo19pcwNJ9NrQ2HASSLiXEWggWibg35p8YqixWzY2Azt9am/fDZaXCQDLo4ukkEnjAA6IyKtimL/iBVO9TboHOv8A+skfUKeHywPmVUxYevqCozZYSpExgsKI48/UlJbJtGtn+IIeG23RJA6tAInsTPoERXycK32gzqoKhAPAfqr0IKhMpUz/2Q==`;

  constructor() { }

  exportAsExcelFile(json: any, excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, `${fileName}${EXCEL_EXTENSION}`);
  }

  generateReport = (title: string, headers: any[], data: any, fileName: string, footerTitle?: string, showLogo: boolean = false) => {
    let doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    if (showLogo) {
      // doc.circle(20, 20, 10, 'S')
      doc.addImage(this.logo, 14, 14, 25, 25);
      // doc.addImage(this.logo, pageWidth / 2.3, 4, 25, 25);
    }

    doc.setFontSize(10)
    doc.text("Ashan Perera", 45, 25);
    doc.text("Senior Software Engineer", 45, 31);
    doc.text("Sample Moto of the particular engineer.", 45, 37);
    // doc.text("Ashan Perera", 45, 35);

    doc.setFontSize(11)
    doc.text(title, pageWidth / 2, 52, { align: 'center' });

    const strctData: any[] = this.structureData(headers, data);
    (doc as any).autoTable({
      bodyStyles: { valign: 'top' },
      styles: { font: 'helvetica', fontStyle: 'bold', lineColor: '#000' },
      head: [headers],
      body: strctData,
      startY: showLogo ? 60 : 14
    });
    doc.text(`${footerTitle ? footerTitle : ''}`, pageWidth / 2.3, doc.internal.pageSize.height - 10);
    doc.save(fileName);
  }

  exportToPDF(title: string, headers: any[], data: any, fileName: string, footerTitle?: string, showImage: boolean = false) {
    let doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    if (showImage) { doc.addImage(this.logo, pageWidth / 2.3, 4, 25, 25); }
    doc.text(title, pageWidth / 2, showImage ? 40 : 8, { align: 'center' });
    doc.setFontSize(7);

    const strctData: any[] = this.structureData(headers, data);
    (doc as any).autoTable({
      bodyStyles: { valign: 'top' },
      styles: { font: 'helvetica', fontStyle: 'bold', lineColor: '#000' },
      head: [headers],
      body: strctData,
      startY: showImage ? 45 : 14
    });

    doc.setFontSize(6);
    doc.text(`${footerTitle ? footerTitle : ''}`, pageWidth / 2.3, doc.internal.pageSize.height - 10);
    doc.save(fileName);
  }

  private structureData = (headers: any[], data: any[]): any[] => {
    let retVal: any[] = [];
    if (data && headers && headers.length > 0 && data.length > 0) {
      retVal = data.map((x, i) => {
        const keys: any[] = Object.keys(x);
        let arrr: any[] = [];

        keys.forEach(x2 => {
          arrr.push(x[x2])
        });
        return arrr;
      })
    }
    return retVal;
  }
}