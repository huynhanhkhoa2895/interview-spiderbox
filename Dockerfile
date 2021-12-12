FROM debian
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get upgrade
RUN apt-get -y install sudo curl apache2 vim wget
RUN sudo apt install -y lsb-release ca-certificates apt-transport-https software-properties-common gnupg2
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/sury-php.list && \
    wget -qO - https://packages.sury.org/php/apt.gpg | sudo apt-key add - && \
    apt-get update
    
RUN sudo apt install -y php8.0 ufw
RUN sudo apt install -y php8.0-curl php8.0-dom php8.0-gd php8.0-mbstring php8.0-simplexml php8.0-xml php8.0-xmlreader php8.0-xmlwriter php8.0-zip php8.0-pgsql php8.0-mysqli 
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer 
RUN sudo rm /var/www/html/index.html
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN sudo apt -y install nodejs
RUN npm i -g yarn
COPY ./docker-conf/backend.conf /etc/apache2/sites-available/backend.conf
COPY ./docker-conf/backend.conf /etc/apache2/sites-available/fontend.conf

COPY docker-conf/apache2.conf /etc/apache2/apache2.conf
# COPY docker-conf/khoadev.local.conf /etc/apache2/sites-available/khoadev.local.conf

RUN mkdir -p /var/www/backend
RUN mkdir -p /var/www/fontend

RUN sudo chown -R $USER:$USER /var/www/backend
RUN sudo chown -R $USER:$USER /var/www/fontend

RUN sudo chmod -R 755 /var/www

COPY ./backend /var/www/backend
COPY ./fontend /var/www/fontend
# COPY docker-conf/server.pem /etc/apache2/server.pem
# COPY docker-conf/server-key.pem /etc/apache2/server-key.pem
RUN cd /etc/apache2/mods-enabled/ && sudo a2enmod rewrite && sudo a2enmod ssl
RUN sudo a2dissite 000-default.conf && \
    sudo a2ensite backend.conf && \
    sudo a2ensite fontend.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf && sudo service apache2 restart



WORKDIR /var/www/html/
EXPOSE 80 
CMD ["apache2ctl", "-D", "FOREGROUND"]