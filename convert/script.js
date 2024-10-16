function konversiBilangan() {
  const dari = document.getElementById("dari").value;
  const ke = document.getElementById("ke").value;
  const input = document.getElementById("input").value;
  let output, penyelesaian;

  switch (dari) {
    case "desimal":
      switch (ke) {
        case "biner":
          output = parseInt(input, 10).toString(2);
          penyelesaian = `Desimal ${input} dikonversi ke biner adalah ${output}`;
          break;
        case "oktal":
          output = parseInt(input, 10).toString(8);
          penyelesaian = `Desimal ${input} dikonversi ke oktal adalah ${output}`;
          break;
        case "heksadesimal":
          output = parseInt(input, 10).toString(16).toUpperCase();
          penyelesaian = `Desimal ${input} dikonversi ke heksadesimal adalah ${output}`;
          break;
        default:
          output = "Pilih konversi yang valid!";
          penyelesaian = "";
      }
      break;
    case "biner":
      switch (ke) {
        case "desimal":
          output = parseInt(input, 2);
          penyelesaian = `Biner ${input} dikonversi ke desimal adalah ${output}`;
          break;
        case "oktal":
          output = parseInt(input, 2).toString(8);
          penyelesaian = `Biner ${input} dikonversi ke oktal adalah ${output}`;
          break;
        case "heksadesimal":
          output = parseInt(input, 2).toString(16).toUpperCase();
          penyelesaian = `Biner ${input} dikonversi ke heksadesimal adalah ${output}`;
          break;
        default:
          output = "Pilih konversi yang valid!";
          penyelesaian = "";
      }
      break;
    case "oktal":
      switch (ke) {
        case "desimal":
          output = parseInt(input, 8);
          penyelesaian = `Oktal ${input} dikonversi ke desimal adalah ${output}`;
          break;
        case "biner":
          output = parseInt(input, 8).toString(2);
          penyelesaian = `Oktal ${input} dikonversi ke biner adalah ${output}`;
          break;
        case "heksadesimal":
          output = parseInt(input, 8).toString(16).toUpperCase();
          penyelesaian = `Oktal ${input} dikonversi ke heksadesimal adalah ${output}`;
          break;
        default:
          output = "Pilih konversi yang valid!";
          penyelesaian = "";
      }
      break;
    case "heksadesimal":
      switch (ke) {
        case "desimal":
          output = parseInt(input, 16);
          penyelesaian = `Heksadesimal ${input} dikonversi ke desimal adalah ${output}`;
          break;
        case "biner":
          output = parseInt(input, 16).toString(2);
          penyelesaian = `Heksadesimal ${input} dikonversi ke biner adalah ${output}`;
          break;
        case "oktal":
          output = parseInt(input, 16).toString(8);
          penyelesaian = `Heksadesimal ${input} dikonversi ke oktal adalah ${output}`;
          break;
        default:
          output = "Pilih konversi yang valid!";
          penyelesaian = "";
      }
      break;
    default:
      output = "Pilih konversi yang valid!";
      penyelesaian = "";
  }

  document.getElementById("output").innerText = output;
  document.getElementById("penyelesaian").innerText = penyelesaian;
}
