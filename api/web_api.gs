/* ---- Abre o documento ---- */
const IMS_FOLDER_ID = "1jb1WsY2jghoRHGN4Y0pKsyi8In8mSOi3"
const ERROR_KEY = "erros";
const EVENTS_SHEET = "eventos";
const MEMBERS_SHEET = "membros";
const ss = SpreadsheetApp.getActiveSpreadsheet();

/* --- Funções Utilitárias --- */

function formatData(object_to_json) {
  console.log(object_to_json)
  return ContentService.createTextOutput().setContent(JSON.stringify(object_to_json));
}

/* --- Configura o menu da planilha --- */
const menuOptions = [];
function onOpen() {
  menuOptions.push({name: 'Obter URL de imagem', functionName: 'obterImagem'});
  menuOptions.push({name: 'Atualizar', functionName: 'updateSite'});
  ss.addMenu('Site LASI', menuOptions);
}

function obterImagem() {
  const folder = DriveApp.getFolderById(IMS_FOLDER_ID);
  const files = folder.getFiles();
  
  // UI is to prompt
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Gerador de Link', 'Insira o nome da imagem (sem extensão):', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const filename = response.getResponseText().trim().toLowerCase();
  let found = false;

  while (files.hasNext()) {
    const file = files.next();
    // Remove extension to get the name
    const nameInDrive = file.getName().split('.')[0].trim().toLowerCase();
    
    if (filename === nameInDrive) {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.getId()}`;
      
      //Show alert with generated link
      ui.alert('Link Gerado (Copie abaixo):', downloadUrl, ui.ButtonSet.OK);
      
      found = true;
      break; 
    }
  }

  if (!found) {
    ui.alert('Arquivo não encontrado na pasta informada.');
  }
}

function getDriveFilesMap() {
  const folder = DriveApp.getFolderById(IMS_FOLDER_ID);
  const files = folder.getFiles();
  const map = {};

  while (files.hasNext()) {
    const file = files.next();
    // Armazena o link usando o nome do arquivo como chave
    map[file.getName()] = `https://drive.google.com/uc?export=download&id=${file.getId()}`;
  }
  return map;
}

function updateSite() {
  // Implementar aqui a atualização do site
  alert('Teste');
}

/* --- Inicia a função GET --- */
function doGet() {
  // JS generic object -> will be parsed to JSON
  const obj_json = {};

  // Try to open "EVENTS_SHEET"
  const evsheet = ss.getSheets().find(v => v.getName().toLowerCase().includes(EVENTS_SHEET));
  if (!evsheet) {
    obj_json["erro"] = "Solicitação de dados [EVENTOS] de inválida. Contate a equipe da LASI.";
    console.log(obj_json);
    return formatData(obj_json);
  }

  // Try to open "MEMBERS_SHEET"
  const mbsheet = ss.getSheets().find(v => v.getName().toLowerCase().includes(MEMBERS_SHEET));
  if (!mbsheet) {
    obj_json["erro"] = "Solicitação de dados [MEMBROS] inválida. Contate a equipe da LASI.";
    console.log(obj_json);
    return formatData(obj_json);
  }

  // Get Event Data -----------------------------------
  // Get the images map in Google Drive
  const fileLinks = getDriveFilesMap();

  // Process the data to replace name by link
  const membersData = mbsheet.getDataRange().getValues();
  const membersHeader = membersData[0];
  const imgColumnIndex = membersHeader.indexOf("Imagens"); // Localiza a coluna dinâmica

  const processedMembers = membersData.filter((v, i) => i != 0).map(row => {
    const fileName = row[imgColumnIndex];
    // If name exists, replaces by link. Else, maintains the empty
    if (fileLinks[fileName]) {
      row[imgColumnIndex] = fileLinks[fileName];
    }
    //console.log(fileLinks[fileName])
    return row;
  });

  obj_json[EVENTS_SHEET] = evsheet.getDataRange().getValues().filter((row, n) => n != 0);
  obj_json[MEMBERS_SHEET] = processedMembers;
  //console.log(processedMembers);

  return formatData(obj_json);
}