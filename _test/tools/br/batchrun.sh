/home/work/.bash_profile
cd /home/work/repos/Tangram-base
/home/work/soft/git-1.7.3.5/bin-wrappers/git pull
sh release/output.sh
rm -rf test/tools/br/report
wget -q -O /tmp/tmp.php http://10.32.34.115:8000/Tangram-base/test/tools/br/runall.php?clearreport=true&cov=true
sleep 3m
rm -rf test/tools/br/report
wget -q -O /tmp/tmp.php http://10.32.34.115:8000/Tangram-base/test/tools/br/runall.php?release=true&clearreport=true
cd -