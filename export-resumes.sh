source .env;

mkdir -p resumes

cd resumes

node utils/export.js | while read -r line ; do

  major=$(echo $line | cut -d',' -f1)
  url=$(echo $line | cut -d',' -f2)
  filename=$(echo $line | cut -d',' -f3)

  mkdir -p $major
  cd $major

  curl $url > $filename

  cd ..

done

cd ..

zip -r resumes.zip resumes

