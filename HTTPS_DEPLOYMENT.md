# Kích hoạt HTTPS cho `sit.tvu.edu.vn`

`nginx.conf` đã được cấu hình để:

- dùng HTTP port 80 cho thử thách ACME của Let's Encrypt;
- chuyển hướng các request HTTP thông thường sang `https://sit.tvu.edu.vn`;
- phục vụ website, API và OAuth qua HTTPS port 443;
- dùng certificate tại `/etc/letsencrypt/live/sit.tvu.edu.vn/`.

## Thực hiện trên VPS

Thay `nginx` bằng `nginx.service` nếu hệ thống dùng tên service đó.

```bash
sudo apt update
sudo apt install -y certbot

# Bảo đảm firewall/security group cho phép HTTP và HTTPS.
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Dừng nginx để certbot standalone có thể dùng port 80.
sudo systemctl stop nginx
sudo certbot certonly --standalone \
  --preferred-challenges http \
  --agree-tos \
  --no-eff-email \
  -m admin@tvu.edu.vn \
  -d sit.tvu.edu.vn

# Chép nginx.conf của repository vào /etc/nginx/nginx.conf, sau đó kiểm tra.
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
```

Nếu nginx đang chạy và không muốn dừng service, có thể dùng webroot sau khi
đã tạo `/var/www/certbot` và cấu hình location ACME:

```bash
sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot -w /var/www/certbot \
  --agree-tos --no-eff-email -m admin@tvu.edu.vn \
  -d sit.tvu.edu.vn
sudo nginx -t && sudo systemctl reload nginx
```

Kiểm tra sau khi triển khai:

```bash
curl -I http://sit.tvu.edu.vn/home/
curl -I https://sit.tvu.edu.vn/home/
sudo certbot renew --dry-run
```

Request HTTP phải trả `301` đến HTTPS; request HTTPS phải trả nội dung website
và certificate phải có hostname `sit.tvu.edu.vn`.
