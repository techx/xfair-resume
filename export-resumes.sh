source .env;

mkdir -p resumes

node utils/export.js | while read -r line ; do

  cd resumes

  major=$(echo $line | cut -d',' -f1)
  url=$(echo $line | cut -d',' -f2)
  filename=$(echo $line | cut -d',' -f3)

  mkdir -p $major
  cd $major

  curl $url > $filename

  cd ..

  cd ..

done

zip -r resumes.zip resumes

