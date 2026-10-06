// Réponses rédigées par l'auto-école pour les 55 vérifications sans réponse dans le document officiel.
// Pictogrammes : Material Design Icons (Pictogrammers, licence libre), https://pictogrammers.com
window.ICONES = {
 "wiper": "M12,4C5,4 2,9 2,9L9,16C9,16 9.5,15.1 10.4,14.5L10.7,16.5C10.3,16.8 10,17.4 10,18A2,2 0 0,0 12,20A2,2 0 0,0 14,18C14,17.1 13.5,16.4 12.7,16.1L12.3,14C14.1,14.2 15,16 15,16L22,9C22,9 19,4 12,4M15.1,13.1C14.3,12.5 13.3,12 12,12L11,6.1C11.3,6 11.7,6 12,6C15.7,6 18.1,7.7 19.3,8.9L15.1,13.1M8.9,13.1L4.7,8.9C5.5,8 7,7 9,6.4L10,12.4C9.6,12.6 9.2,12.8 8.9,13.1Z",
 "gas-station": "M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z",
 "car-defrost-rear": "M10,18.3C10,20.5 7.9,22.5 7.7,22.7C7.5,22.9 7.2,23 7,23C6.7,23 6.5,22.9 6.2,22.6C5.9,22.2 5.9,21.6 6.3,21.2C6.8,20.8 8,19.4 8,18.3C8,17.7 7.6,17.1 7.2,16.4C6.6,15.6 6,14.6 6,13.4C6,11.1 7.3,10.2 7.5,10.1C7.9,9.9 8.6,10 8.8,10.4C9.1,10.9 9,11.5 8.5,11.8C8.5,11.8 8,12.2 8,13.4C8,14.1 8.4,14.7 8.8,15.3C9.4,16.1 10,17.1 10,18.3M12,13.4C12,12.2 12.5,11.8 12.5,11.8C13,11.5 13.1,10.9 12.8,10.4C12.5,9.9 11.9,9.8 11.4,10.1C11.2,10.2 9.9,11.1 9.9,13.4C9.9,14.6 10.5,15.6 11.1,16.4C11.5,17.1 11.9,17.7 11.9,18.3C11.9,19.4 10.7,20.8 10.2,21.2C9.8,21.6 9.8,22.2 10.1,22.6C10.3,22.8 10.6,22.9 10.8,22.9C11.2,23 11.5,22.9 11.7,22.7C11.9,22.5 14,20.5 14,18.3C14,17.1 13.4,16.1 12.8,15.3C12.4,14.6 12,14 12,13.4M20,3H4A2,2 0 0,0 2,5V16A2,2 0 0,0 4,18H5V16H4V5H20V16H19V18H20A2,2 0 0,0 22,16V5A2,2 0 0,0 20,3M16.2,13.5C16.2,12.3 16.7,11.9 16.7,11.9C17.1,11.6 17.3,11 17,10.5C16.7,10.1 16.1,9.9 15.6,10.2C15.4,10.3 14.1,11.2 14.1,13.5C14.1,14.7 14.8,15.7 15.3,16.5C15.7,17.2 16.1,17.8 16.1,18.4C16.1,19.5 14.9,20.9 14.4,21.3C14,21.7 13.9,22.3 14.3,22.7C14.5,22.9 14.7,23 15,23C15.2,23 15.5,22.9 15.9,22.8C16.1,22.6 18.2,20.6 18.2,18.4C18.2,17.2 17.5,16.2 17,15.4C16.6,14.7 16.2,14.1 16.2,13.5Z",
 "oil": "M22,12.5C22,12.5 24,14.67 24,16A2,2 0 0,1 22,18A2,2 0 0,1 20,16C20,14.67 22,12.5 22,12.5M6,6H10A1,1 0 0,1 11,7A1,1 0 0,1 10,8H9V10H11C11.74,10 12.39,10.4 12.73,11L19.24,7.24L22.5,9.13C23,9.4 23.14,10 22.87,10.5C22.59,10.97 22,11.14 21.5,10.86L19.4,9.65L15.75,15.97C15.41,16.58 14.75,17 14,17H5A2,2 0 0,1 3,15V12A2,2 0 0,1 5,10H7V8H6A1,1 0 0,1 5,7A1,1 0 0,1 6,6M5,12V15H14L16.06,11.43L12.6,13.43L11.69,12H5M0.38,9.21L2.09,7.5C2.5,7.11 3.11,7.11 3.5,7.5C3.89,7.89 3.89,8.5 3.5,8.91L1.79,10.62C1.4,11 0.77,11 0.38,10.62C0,10.23 0,9.6 0.38,9.21Z",
 "glass-cocktail-off": "M13.33 12.67L7.66 7L6.13 5.47L2.39 1.73L1.11 3L3 4.89V5L11 13V19H6V21H18V19.89L20.84 22.73L22.11 21.46L13.33 12.67M13 19V14.89L17.11 19H13M8.2 5L6.2 3H21V5L14.6 11.4L10.2 7H16.5L18.5 5H8.2Z",
 "car-battery": "M4,3V6H1V20H23V6H20V3H14V6H10V3H4M3,8H21V18H3V8M15,10V12H13V14H15V16H17V14H19V12H17V10H15M5,12V14H11V12H5Z",
 "car-brake-alert": "M11,15H13V17H11V15M11,7H13V13H11V7M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19C8.14,19 5,15.86 5,12C5,8.14 8.14,5 12,5C15.86,5 19,8.14 19,12C19,15.86 15.86,19 12,19M20.5,20.5C22.66,18.31 24,15.31 24,12C24,8.69 22.66,5.69 20.5,3.5L19.42,4.58C21.32,6.5 22.5,9.11 22.5,12C22.5,14.9 21.32,17.5 19.42,19.42L20.5,20.5M4.58,19.42C2.68,17.5 1.5,14.9 1.5,12C1.5,9.11 2.68,6.5 4.58,4.58L3.5,3.5C1.34,5.69 0,8.69 0,12C0,15.31 1.34,18.31 3.5,20.5L4.58,19.42Z",
 "coolant-temperature": "M11.5,1A1.5,1.5 0 0,0 10,2.5V14.5C9.37,14.97 9,15.71 9,16.5A2.5,2.5 0 0,0 11.5,19A2.5,2.5 0 0,0 14,16.5C14,15.71 13.63,15 13,14.5V13H17V11H13V9H17V7H13V5H17V3H13V2.5A1.5,1.5 0 0,0 11.5,1M0,15V17C0.67,17 0.79,17.21 1.29,17.71C1.79,18.21 2.67,19 4,19C5.33,19 6.21,18.21 6.71,17.71C6.82,17.59 6.91,17.5 7,17.41V15.16C6.21,15.42 5.65,15.93 5.29,16.29C4.79,16.79 4.67,17 4,17C3.33,17 3.21,16.79 2.71,16.29C2.21,15.79 1.33,15 0,15M16,15V17C16.67,17 16.79,17.21 17.29,17.71C17.79,18.21 18.67,19 20,19C21.33,19 22.21,18.21 22.71,17.71C23.21,17.21 23.33,17 24,17V15C22.67,15 21.79,15.79 21.29,16.29C20.79,16.79 20.67,17 20,17C19.33,17 19.21,16.79 18.71,16.29C18.21,15.79 17.33,15 16,15M8,20C6.67,20 5.79,20.79 5.29,21.29C4.79,21.79 4.67,22 4,22C3.33,22 3.21,21.79 2.71,21.29C2.35,20.93 1.79,20.42 1,20.16V22.41C1.09,22.5 1.18,22.59 1.29,22.71C1.79,23.21 2.67,24 4,24C5.33,24 6.21,23.21 6.71,22.71C7.21,22.21 7.33,22 8,22C8.67,22 8.79,22.21 9.29,22.71C9.73,23.14 10.44,23.8 11.5,23.96C11.66,24 11.83,24 12,24C13.33,24 14.21,23.21 14.71,22.71C15.21,22.21 15.33,22 16,22C16.67,22 16.79,22.21 17.29,22.71C17.79,23.21 18.67,24 20,24C21.33,24 22.21,23.21 22.71,22.71C22.82,22.59 22.91,22.5 23,22.41V20.16C22.21,20.42 21.65,20.93 21.29,21.29C20.79,21.79 20.67,22 20,22C19.33,22 19.21,21.79 18.71,21.29C18.21,20.79 17.33,20 16,20C14.67,20 13.79,20.79 13.29,21.29C12.79,21.79 12.67,22 12,22C11.78,22 11.63,21.97 11.5,21.92C11.22,21.82 11.05,21.63 10.71,21.29C10.21,20.79 9.33,20 8,20Z",
 "car-door": "M19,14H16V16H19V14M22,21H3V11L11,3H21A1,1 0 0,1 22,4V21M11.83,5L5.83,11H20V5H11.83Z",
 "hazard-lights": "M12,12L14.33,16H9.68L12,12M12,8L6.21,18H17.8L12,8M12,2L1,21H23L12,2M12,6L19.53,19H4.47L12,6Z",
 "tire": "M19.66 9.64L19.3 8.7L21.16 8C20.24 5.88 18.6 4.18 16.54 3.14L15.74 4.92L14.82 4.5L15.62 2.7C14.5 2.26 13.28 2 12 2C10.94 2 9.92 2.22 8.96 2.5L9.64 4.34L8.7 4.7L8 2.84C5.88 3.76 4.18 5.4 3.14 7.46L4.92 8.26L4.5 9.18L2.7 8.38C2.26 9.5 2 10.72 2 12C2 13.06 2.22 14.08 2.5 15.04L4.34 14.36L4.7 15.3L2.84 16C3.76 18.12 5.4 19.82 7.46 20.86L8.26 19.08L9.18 19.5L8.38 21.3C9.5 21.74 10.72 22 12 22C13.06 22 14.08 21.78 15.04 21.5L14.36 19.66L15.3 19.3L16 21.16C18.12 20.24 19.82 18.6 20.86 16.54L19.08 15.74L19.5 14.82L21.3 15.62C21.74 14.5 22 13.28 22 12C22 10.94 21.78 9.92 21.5 8.96L19.66 9.64M14.3 17.54C11.24 18.8 7.72 17.36 6.46 14.3S6.64 7.72 9.7 6.46 16.28 6.64 17.54 9.7C18.82 12.76 17.36 16.28 14.3 17.54Z",
 "car-cruise-control": "M22,15C22,17.6 20.8,19.9 18.9,21.3L18.4,20.8L16.3,18.7L17.7,17.3L18.9,18.5C19.4,17.8 19.8,16.9 19.9,16H18V14H19.9C19.7,13.1 19.4,12.3 18.9,11.5L17.7,12.7L16.3,11.3L17.5,10.1C16.8,9.6 15.9,9.2 15,9.1V11H13V9.1C12.1,9.3 11.3,9.6 10.5,10.1L13.5,13.1C13.7,13.1 13.8,13 14,13A2,2 0 0,1 16,15A2,2 0 0,1 14,17A2,2 0 0,1 12,15C12,14.8 12,14.7 12.1,14.5L9.1,11.5C8.6,12.2 8.2,13.1 8.1,14H10V16H8.1C8.3,16.9 8.6,17.7 9.1,18.5L10.3,17.3L11.7,18.7L9.1,21.3C7.2,19.9 6,17.6 6,15A8,8 0 0,1 14,7A8,8 0 0,1 22,15M6.7,5.3L3.4,2L2,3.4L5.3,6.7L4,8H8V4L6.7,5.3Z",
 "bullhorn": "M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z",
 "airbag": "M14,8A5,5 0 0,1 9,13A5,5 0 0,1 4,8A5,5 0 0,1 9,3A5,5 0 0,1 14,8M10.46,15.55L13,18.03L11,18.05L7.5,21.58L6,20.09L10.46,15.55M17,2C18.08,2 19,2.88 19,4C19,5.08 18.12,6 17,6C15.92,6 15,5.12 15,4C15,2.92 15.89,2 17,2M14.41,15H11.59L17.29,20.71L18.71,19.29L14.41,15M15.12,14.29L19.41,18.59L19.63,18.8C19.86,18.42 20,18 20,17.5V9.5A2.5,2.5 0 0,0 17.5,7A2.5,2.5 0 0,0 15,9.5V14.17L15.12,14.29Z",
 "car-tire-alert": "M11,13H13V15H11V13M11,5H13V11H11V5M17,4.76C18.86,6.19 20,8.61 20,11C20,14 18.33,16.64 15.86,18H8.14C5.67,16.64 4,14 4,11C4,8.61 5.09,6.17 7,4.76V2H5V3.86C3.15,5.68 2,8.2 2,11C2,13.8 3.15,16.32 5,18.14V22H7V20H9V22H11V20H13V22H15V20H17V22H19V18.14C20.85,16.32 22,13.8 22,11C22,8.2 20.85,5.68 19,3.86V2H17V4.76Z",
 "seatbelt": "M12,2C13.11,2 14,2.9 14,4C14,5.11 13.11,6 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M12.39,14.79C14.03,14.79 15.46,14.89 16.64,15.04C16.7,12.32 16.46,9.92 16,9C15.87,8.73 15.69,8.5 15.5,8.3L7.43,15.22C8.79,15 10.5,14.79 12.39,14.79M7.46,17C7.59,18.74 7.85,20.5 8.27,22H10.34C10.05,21.12 9.84,20.09 9.68,19C9.68,19 12,18.56 14.32,19C14.16,20.09 13.95,21.12 13.66,22H15.73C16.17,20.45 16.43,18.61 16.56,16.79C15.41,16.65 14,16.54 12.39,16.54C10.46,16.54 8.78,16.75 7.46,17M12,7C12,7 9,7 8,9C7.66,9.68 7.44,11.15 7.37,12.96L13.92,7.34C12.93,7 12,7 12,7M18.57,5.67L17.43,4.34L13.92,7.35C14.47,7.54 15.05,7.84 15.5,8.3L18.57,5.67M20.67,15.83C20.58,15.8 19.14,15.33 16.64,15.04C16.63,15.61 16.6,16.2 16.56,16.79C18.81,17.07 20.1,17.5 20.12,17.5L20.67,15.83M7.37,12.96L3.43,16.34L4.32,17.82C4.34,17.81 5.5,17.36 7.46,17C7.35,15.59 7.32,14.2 7.37,12.96Z",
 "file-document": "M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z",
 "car-door-lock": "M7.8 17V15.5C7.8 14.1 6.4 13 5 13S2.2 14.1 2.2 15.5V17C1.6 17 1 17.6 1 18.2V21.7C1 22.4 1.6 23 2.2 23H7.7C8.4 23 9 22.4 9 21.8V18.3C9 17.6 8.4 17 7.8 17M6.5 17H3.5V15.5C3.5 14.7 4.2 14.2 5 14.2S6.5 14.7 6.5 15.5V17M21 3H11L3 11V11.44C3.61 11.17 4.29 11 5 11C7.6 11 9.8 13.06 9.8 15.5V15.75C10.53 16.36 11 17.28 11 18.3V21H22V4C22 3.45 21.55 3 21 3M19 16H16V14H19V16M20 11H5.83L11.83 5H20V11Z",
 "car-light-fog": "M13,4.8C9,4.8 9,19.2 13,19.2C17,19.2 22,16.5 22,12C22,7.5 17,4.8 13,4.8M13.1,17.2C12.7,16.8 12,15 12,12C12,9 12.7,7.2 13.1,6.8C16,6.9 20,8.7 20,12C20,15.3 16,17.1 13.1,17.2M6,8V11H8C8,11.3 8,11.7 8,12C8,12.3 8,12.7 8,13H6V16H8.4C8.6,16.7 8.8,17.4 9,18H6V21H4V18H2V16H4V13H2V11H4V8H2V6H4V3H6V6H9C9,6.1 8.9,6.2 8.9,6.4C8.7,6.9 8.5,7.4 8.4,8H6Z",
 "car-seat": "M7 18C7 18 4 10 4 6S6 2 6 2H7C7 2 8 2 8 3S7 4 7 6 10 10 10 13 7 18 7 18M12 17C11 17 8 19.5 8 19.5C7.7 19.7 7.8 20 8 20.3C8 20.3 9 22.1 11 22.1H17C18.1 22.1 19 21.2 19 20.1V19.1C19 18 18.1 17.1 17 17.1H12Z",
 "car-wrench": "M20.96 16.45C20.97 16.3 21 16.15 21 16V16.5L20.96 16.45M11 16C11 16.71 11.15 17.39 11.42 18H6V19C6 19.55 5.55 20 5 20H4C3.45 20 3 19.55 3 19V11L5.08 5C5.28 4.42 5.84 4 6.5 4H17.5C18.16 4 18.72 4.42 18.92 5L21 11V16C21 13.24 18.76 11 16 11S11 13.24 11 16M8 13.5C8 12.67 7.33 12 6.5 12S5 12.67 5 13.5 5.67 15 6.5 15 8 14.33 8 13.5M19 10L17.5 5.5H6.5L5 10H19M22.87 21.19L18.76 17.08C19.17 16.04 18.94 14.82 18.08 13.97C17.18 13.06 15.83 12.88 14.74 13.38L16.68 15.32L15.33 16.68L13.34 14.73C12.8 15.82 13.05 17.17 13.93 18.08C14.79 18.94 16 19.16 17.05 18.76L21.16 22.86C21.34 23.05 21.61 23.05 21.79 22.86L22.83 21.83C23.05 21.65 23.05 21.33 22.87 21.19Z",
 "autorenew": "M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z",
 "car-light-high": "M13,4.8C9,4.8 9,19.2 13,19.2C17,19.2 22,16.5 22,12C22,7.5 17,4.8 13,4.8M13.1,17.2C12.7,16.8 12,15 12,12C12,9 12.7,7.2 13.1,6.8C16,6.9 20,8.7 20,12C20,15.3 16,17.1 13.1,17.2M2,5H9.5C9.3,5.4 9,5.8 8.9,6.4C8.8,6.6 8.8,6.8 8.7,7H2V5M8,11H2V9H8.2C8.1,9.6 8.1,10.3 8,11M8.7,17C8.9,17.8 9.2,18.4 9.6,19H2.1V17H8.7M8.2,15H2V13H8C8.1,13.7 8.1,14.4 8.2,15Z",
 "file-document-edit": "M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H10V20.09L12.09,18H6V16H14.09L16.09,14H6V12H18.09L20,10.09V8L14,2H6M13,3.5L18.5,9H13V3.5M20.15,13C20,13 19.86,13.05 19.75,13.16L18.73,14.18L20.82,16.26L21.84,15.25C22.05,15.03 22.05,14.67 21.84,14.46L20.54,13.16C20.43,13.05 20.29,13 20.15,13M18.14,14.77L12,20.92V23H14.08L20.23,16.85L18.14,14.77Z",
 "triangle-outline": "M12,2L1,21H23M12,6L19.53,19H4.47",
 "car-speed-limiter": "M18 15C18 17.6 16.8 19.9 14.9 21.3L14.4 20.8L12.3 18.7L13.7 17.3L14.9 18.5C15.4 17.8 15.8 16.9 15.9 16H14V14H15.9C15.7 13.1 15.4 12.3 14.9 11.5L13.7 12.7L12.3 11.3L13.5 10.1C12.8 9.6 11.9 9.2 11 9.1V11H9V9.1C8.1 9.3 7.3 9.6 6.5 10.1L9.5 13.1C9.7 13.1 9.8 13 10 13C11.11 13 12 13.9 12 15S11.11 17 10 17 8 16.11 8 15C8 14.8 8 14.7 8.1 14.5L5.1 11.5C4.6 12.2 4.2 13.1 4.1 14H6V16H4.1C4.3 16.9 4.6 17.7 5.1 18.5L6.3 17.3L7.7 18.7L5.1 21.3C3.2 19.9 2 17.6 2 15C2 10.58 5.58 7 10 7S18 10.58 18 15M23 5C23 3.34 21.66 2 20 2S17 3.34 17 5C17 6.3 17.84 7.4 19 7.82V11H21V7.82C22.16 7.4 23 6.3 23 5M20 6C19.45 6 19 5.55 19 5S19.45 4 20 4 21 4.45 21 5 20.55 6 20 6Z",
 "lightbulb": "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z",
 "car-back": "M6,11L7,7H17L18,11M18.92,6C18.71,5.4 18.14,5 17.5,5H6.5C5.86,5 5.29,5.4 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V18H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6M7,16H5V14H7V16M19,16H17V14H19V16M14,16H10V14H14V16Z",
 "wiper-wash": "M13,6C13,5.7 13.1,4.6 13.8,3.8L12,2.4L10.2,3.9C10.9,4.6 11,5.7 11,6C4.7,6.4 2,11 2,11L9,18C9,18 9.7,16.7 11,16.2V18.3C10.4,18.6 10,19.3 10,20A2,2 0 0,0 12,22A2,2 0 0,0 14,20C14,19.3 13.6,18.6 13,18.3V16.2C14.3,16.7 15,18 15,18L22,11C22,11 19.3,6.5 13,6M11,14.1C10.2,14.3 9.5,14.6 8.9,15.1L4.7,10.9C5.8,9.8 7.8,8.3 11,8.1V14.1M15.1,15.1C14.5,14.7 13.8,14.3 13,14.1V8.1C16.2,8.4 18.2,9.8 19.3,10.9L15.1,15.1M18,1.3L17.3,3.2C16.6,2.9 15.5,2.9 14.7,3.2L14,1.3C15.2,0.9 16.8,0.9 18,1.3M21,6H19C19,6 19,4.7 18.2,3.9L19.7,2.6C21,4 21,5.9 21,6M4.2,2.6L5.7,3.9C5,4.7 5,6 5,6H3C3,5.9 3,4 4.2,2.6M10,1.3L9.3,3.2C8.6,2.9 7.5,2.9 6.7,3.2L6,1.3C7.2,0.9 8.8,0.9 10,1.3Z"
};
window.COMPLEMENTS = {
 "5": {
  "reponse": "Manette à droite du volant en général : la pousser (ou la tourner) jusqu'au dernier cran, la position la plus rapide.",
  "icone": "wiper",
  "couleur": "var(--text)"
 },
 "10": {
  "reponse": "Soulever chaque balai, à l'avant et à l'arrière, et vérifier que le caoutchouc n'est ni fendu, ni déchiré, ni durci.",
  "icone": "wiper",
  "couleur": "var(--text)"
 },
 "11": {
  "reponse": "Jauge au tableau de bord, avec le pictogramme d'une pompe à essence. La petite flèche à côté indique de quel côté se trouve la trappe.",
  "icone": "gas-station",
  "couleur": "var(--text)"
 },
 "13": {
  "reponse": "Bouton avec une vitre rectangulaire et des flèches ondulées. Un voyant orange s'allume sur le bouton ou au tableau de bord.",
  "icone": "car-defrost-rear",
  "couleur": "#f29a0e"
 },
 "15": {
  "reponse": "Voyant rouge en forme de burette d'huile. S'il s'allume en roulant, s'arrêter dès que possible et couper le moteur.",
  "icone": "oil",
  "couleur": "#e5322d"
 },
 "17": {
  "reponse": "Le montrer dans le véhicule, souvent dans la boîte à gants ou le vide-poches de la portière.",
  "icone": "glass-cocktail-off",
  "couleur": "var(--text)"
 },
 "23": {
  "reponse": "Voyant rouge en forme de batterie avec les signes + et −. Allumé en roulant : la batterie ne se recharge plus, consulter un garage.",
  "icone": "car-battery",
  "couleur": "#e5322d"
 },
 "25": {
  "reponse": "Rouge. Il représente un point d'exclamation dans un cercle, entre parenthèses.",
  "icone": "car-brake-alert",
  "couleur": "#e5322d"
 },
 "27": {
  "reponse": "Voyant rouge : un thermomètre plongé dans des vagues. S'il s'allume, s'arrêter et couper le moteur.",
  "icone": "coolant-temperature",
  "couleur": "#e5322d"
 },
 "29": {
  "reponse": "Voyant rouge, ou dessin sur l'écran, montrant la voiture vue de dessus avec une porte ouverte.",
  "icone": "car-door",
  "couleur": "#e5322d"
 },
 "31": {
  "reponse": "Bouton rouge avec un triangle, au centre de la planche de bord. Tous les clignotants et leurs témoins verts clignotent en même temps.",
  "icone": "hazard-lights",
  "couleur": "#e5322d"
 },
 "32": {
  "reponse": "Sur le flanc du pneu, repère « TWI » ou petit triangle. Il indique où se trouvent les témoins d'usure dans les rainures : profondeur minimale 1,6 mm.",
  "icone": "tire",
  "couleur": "var(--text)"
 },
 "33": {
  "reponse": "En général sur le volant ou sur une petite manette à gauche, avec le pictogramme d'un compteur et d'une flèche. Un voyant s'allume au tableau de bord quand il est actif.",
  "icone": "car-cruise-control",
  "couleur": "#16a34a"
 },
 "34": {
  "reponse": "Ouvrir la trappe (bouton, levier au plancher ou simple pression), vérifier que le bouchon est bien vissé jusqu'au clic, puis refermer.",
  "icone": "gas-station",
  "couleur": "var(--text)"
 },
 "35": {
  "reponse": "Montrer le centre du volant, où se trouve le pictogramme du klaxon, sans appuyer.",
  "icone": "bullhorn",
  "couleur": "var(--text)"
 },
 "37": {
  "reponse": "Contacteur à clé, souvent sur le côté de la planche de bord côté passager ou dans la boîte à gants. Un voyant « airbag OFF » le confirme. À désactiver si un siège enfant dos à la route est installé à l'avant.",
  "icone": "airbag",
  "couleur": "#f29a0e"
 },
 "38": {
  "reponse": "Lire l'étiquette des pressions, souvent sur le montant de la portière conducteur ou dans la trappe à carburant, et donner la valeur arrière « en charge », en bars.",
  "icone": "car-tire-alert",
  "couleur": "var(--text)"
 },
 "39": {
  "reponse": "Voyant rouge : un personnage avec sa ceinture, souvent accompagné d'un signal sonore.",
  "icone": "seatbelt",
  "couleur": "#e5322d"
 },
 "41": {
  "reponse": "Montrer l'attestation d'assurance (Mémo véhicule assuré). Depuis le 1er avril 2024, la vignette verte n'est plus obligatoire sur le pare-brise.",
  "icone": "file-document",
  "couleur": "var(--text)"
 },
 "42": {
  "reponse": "Petit levier ou fente sur la tranche de la portière arrière, visible porte ouverte. Une fois enclenchée, la porte ne s'ouvre plus de l'intérieur.",
  "icone": "car-door-lock",
  "couleur": "var(--text)"
 },
 "43": {
  "reponse": "Bague de la manette des feux ou bouton dédié. Voyant orange : une lampe aux rayons horizontaux traversés par une ligne ondulée.",
  "icone": "car-light-fog",
  "couleur": "#f29a0e"
 },
 "45": {
  "reponse": "Appuyer sur le bouton à la base d'une des tiges et faire monter ou descendre l'appui-tête. Le haut de l'appui-tête doit arriver au niveau du haut de la tête.",
  "icone": "car-seat",
  "couleur": "var(--text)"
 },
 "47": {
  "reponse": "Orange.",
  "icone": "car-light-fog",
  "couleur": "#f29a0e"
 },
 "48": {
  "reponse": "Tirer la manette dans l'habitacle (souvent sous le volant, à gauche), libérer le crochet de sécurité à l'avant, lever le capot et poser la béquille si besoin. Pour refermer, le laisser tomber d'une vingtaine de centimètres puis vérifier qu'il ne se soulève plus.",
  "icone": "car-wrench",
  "couleur": "var(--text)"
 },
 "49": {
  "reponse": "Bouton avec une voiture et une flèche qui tourne à l'intérieur. Il empêche l'air extérieur d'entrer (tunnel, pollution) mais favorise la buée.",
  "icone": "autorenew",
  "couleur": "var(--text)"
 },
 "51": {
  "reponse": "Pousser la manette des feux vers le tableau de bord. Le voyant des feux de route est bleu.",
  "icone": "car-light-high",
  "couleur": "#2563eb"
 },
 "53": {
  "reponse": "Le montrer, souvent dans la boîte à gants avec les papiers du véhicule. Il n'est pas obligatoire mais fortement conseillé.",
  "icone": "file-document-edit",
  "couleur": "var(--text)"
 },
 "54": {
  "reponse": "Le montrer, souvent dans le coffre. Le gilet jaune, lui, doit être à portée de main depuis le poste de conduite.",
  "icone": "triangle-outline",
  "couleur": "#e5322d"
 },
 "55": {
  "reponse": "Rouge. Il représente un point d'exclamation dans un cercle, entre parenthèses.",
  "icone": "car-brake-alert",
  "couleur": "#e5322d"
 },
 "57": {
  "reponse": "En général sur le volant ou sur une petite manette à gauche, souvent marquée « LIM ». Un voyant s'allume au tableau de bord quand il est actif.",
  "icone": "car-speed-limiter",
  "couleur": "var(--text)"
 },
 "58": {
  "reponse": "Ouvrir le coffre et montrer la trappe ou le cache derrière le bloc du feu arrière. Sur certains modèles, il faut démonter le feu.",
  "icone": "lightbulb",
  "couleur": "var(--text)"
 },
 "59": {
  "reponse": "Tourner ou pousser l'extrémité de la manette des essuie-glaces, souvent vers l'avant. Le pictogramme montre la lunette arrière.",
  "icone": "wiper",
  "couleur": "var(--text)"
 },
 "60": {
  "reponse": "Ouvrir le coffre (bouton, clé ou poignée), le refermer, puis tirer légèrement pour vérifier qu'il est bien verrouillé.",
  "icone": "car-back",
  "couleur": "var(--text)"
 },
 "62": {
  "reponse": "Ouvrir le coffre (bouton, clé ou poignée), le refermer, puis tirer légèrement pour vérifier qu'il est bien verrouillé.",
  "icone": "car-back",
  "couleur": "var(--text)"
 },
 "64": {
  "reponse": "Tirer la manette dans l'habitacle (souvent sous le volant, à gauche), libérer le crochet de sécurité à l'avant, lever le capot et poser la béquille si besoin. Pour refermer, le laisser tomber d'une vingtaine de centimètres puis vérifier qu'il ne se soulève plus.",
  "icone": "car-wrench",
  "couleur": "var(--text)"
 },
 "66": {
  "reponse": "Petites buses sur le capot ou en bas du pare-brise, près des balais.",
  "icone": "wiper-wash",
  "couleur": "var(--text)"
 },
 "69": {
  "reponse": "Manette à droite du volant en général : la pousser (ou la tourner) jusqu'au dernier cran, la position la plus rapide.",
  "icone": "wiper",
  "couleur": "var(--text)"
 },
 "73": {
  "reponse": "Bouton avec une vitre rectangulaire et des flèches ondulées. Un voyant orange s'allume sur le bouton ou au tableau de bord.",
  "icone": "car-defrost-rear",
  "couleur": "#f29a0e"
 },
 "75": {
  "reponse": "Voyant rouge en forme de burette d'huile. S'il s'allume en roulant, s'arrêter dès que possible et couper le moteur.",
  "icone": "oil",
  "couleur": "#e5322d"
 },
 "77": {
  "reponse": "Le montrer dans le véhicule, souvent dans la boîte à gants ou le vide-poches de la portière.",
  "icone": "glass-cocktail-off",
  "couleur": "var(--text)"
 },
 "81": {
  "reponse": "Rouge. Il représente un point d'exclamation dans un cercle, entre parenthèses.",
  "icone": "car-brake-alert",
  "couleur": "#e5322d"
 },
 "83": {
  "reponse": "Voyant rouge : un thermomètre plongé dans des vagues. S'il s'allume, s'arrêter et couper le moteur.",
  "icone": "coolant-temperature",
  "couleur": "#e5322d"
 },
 "84": {
  "reponse": "Sur le flanc du pneu, repère « TWI » ou petit triangle. Il indique où se trouvent les témoins d'usure dans les rainures : profondeur minimale 1,6 mm.",
  "icone": "tire",
  "couleur": "var(--text)"
 },
 "85": {
  "reponse": "Bouton rouge avec un triangle, au centre de la planche de bord. Tous les clignotants et leurs témoins verts clignotent en même temps.",
  "icone": "hazard-lights",
  "couleur": "#e5322d"
 },
 "86": {
  "reponse": "Lire l'étiquette des pressions, souvent sur le montant de la portière conducteur ou dans la trappe à carburant, et donner la valeur arrière « en charge », en bars.",
  "icone": "car-tire-alert",
  "couleur": "var(--text)"
 },
 "87": {
  "reponse": "Contacteur à clé, souvent sur le côté de la planche de bord côté passager ou dans la boîte à gants. Un voyant « airbag OFF » le confirme. À désactiver si un siège enfant dos à la route est installé à l'avant.",
  "icone": "airbag",
  "couleur": "#f29a0e"
 },
 "88": {
  "reponse": "Petit levier ou fente sur la tranche de la portière arrière, visible porte ouverte. Une fois enclenchée, la porte ne s'ouvre plus de l'intérieur.",
  "icone": "car-door-lock",
  "couleur": "var(--text)"
 },
 "89": {
  "reponse": "Voyant rouge : un personnage avec sa ceinture, souvent accompagné d'un signal sonore.",
  "icone": "seatbelt",
  "couleur": "#e5322d"
 },
 "91": {
  "reponse": "Bague de la manette des feux ou bouton dédié. Voyant orange : une lampe aux rayons horizontaux traversés par une ligne ondulée.",
  "icone": "car-light-fog",
  "couleur": "#f29a0e"
 },
 "93": {
  "reponse": "Bouton avec une voiture et une flèche qui tourne à l'intérieur. Il empêche l'air extérieur d'entrer (tunnel, pollution) mais favorise la buée.",
  "icone": "autorenew",
  "couleur": "var(--text)"
 },
 "94": {
  "reponse": "Le montrer, souvent dans le coffre. Le gilet jaune, lui, doit être à portée de main depuis le poste de conduite.",
  "icone": "triangle-outline",
  "couleur": "#e5322d"
 },
 "95": {
  "reponse": "Pousser la manette des feux vers le tableau de bord. Le voyant des feux de route est bleu.",
  "icone": "car-light-high",
  "couleur": "#2563eb"
 },
 "97": {
  "reponse": "Tourner ou pousser l'extrémité de la manette des essuie-glaces, souvent vers l'avant. Le pictogramme montre la lunette arrière.",
  "icone": "wiper",
  "couleur": "var(--text)"
 },
 "98": {
  "reponse": "Ouvrir le coffre et montrer la trappe ou le cache derrière le bloc du feu arrière. Sur certains modèles, il faut démonter le feu.",
  "icone": "lightbulb",
  "couleur": "var(--text)"
 },
 "100": {
  "reponse": "Petites buses sur le capot ou en bas du pare-brise, près des balais.",
  "icone": "wiper-wash",
  "couleur": "var(--text)"
 }
};
