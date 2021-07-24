const langForserver = [
    'cpp17',
    'nodejs',
    'python3',
    'java',
    'go'
];
const lang = [
    'c_cpp',
    'javascript',
    'python',
    'java',
    'golang'
];
const themes = [
    'monokai',
    'solarized_light',
    'xcode',
    'tomorrow_night'
];
const default_codes = [
    "#include <bits/stdc++.h>"+"\n"+"using namespace std;"+"\n"+"int main() {"+"\n"+"\tcout<<\"Hello, World!\";"+"\n"+"}",
    "console.log('Hello, World!');",
    "print('Hello, World!')",
    "public class HelloWorld"+"\n"+"{"+"\n\t"+"public static void main(String args[])"+" {\n\t\t"+"System.out.println(\"Hello, World\");"+"\n\t}\n"+"}",
    "package main"+"\n"+"import \"fmt\"\n\n"+"func main() {"+"\n\t"+"fmt.Println(\"Hello, World\")"+"\n"+"}"
];

export {langForserver, lang, themes, default_codes};