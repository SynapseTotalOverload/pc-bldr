import subprocess
import json
import os
from bs4 import BeautifulSoup

def fetch_category_data(category: str, page: int = 1):
    try:
        curl_command = [
            "curl",
            "https://pcpartpicker.com/qapi/product/category/",
            "-H", "accept: application/json, text/javascript, */*; q=0.01",
            "-H", "accept-language: en-GB,en-US;q=0.9,en;q=0.8",
            "-H", "content-type: application/x-www-form-urlencoded; charset=UTF-8",
            "-b", "xcsrftoken=aECQxhUhZukiUWi2li8AaDPxKuTNsUZn; xsessionid=23owexvzwhcbzl8tn5ybyytuq7nzr87s; cf_clearance=yUYi689bcJM1CmhEdul9M2i_hSI4sobu9Q8cO8ygcTM-1749645807-1.2.1.1-Zud4ZVYECqmjx1NmT7hQ_vVuF20lAAHUJlsPP8IToIdsbkhZ9p9tM.2V0asdUylK11qLQskyHtqR3ZGQQ1a430B9jFqPMz8TZ5sIPjFQuxZDBmPfffcBrPRu.yUTU24ASI6xN_PoHHmLUjI1FExonsgDrWZH7H0JLWNT7dI8ERvOEE38kWAU5xz2AATG5isOCggn5TMSRcV9nxjjXPONXcXB8Se7lpbnMHPzMbH5NIJzYzGv9RUaqMPaGl__YcCqEy7jdBsLdjv8bb675roB11fOGatiSTDEapfRAweCzmoCXhc3xJDQxtELXhPPZQ7v3XcX6O4nHuz1MZYknkY5AkbbB0exNdCKzSTj.TSroVkWbjQ5QaNnX0DF9OHqksV4",
            "-H", "origin: https://pcpartpicker.com",
            "-H", "priority: u=1, i",
            "-H", f"referer: https://pcpartpicker.com/products/{category}/",
            "-H", "sec-ch-ua: \"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
            "-H", "sec-ch-ua-arch: \"arm\"",
            "-H", "sec-ch-ua-bitness: \"64\"",
            "-H", "sec-ch-ua-full-version: \"137.0.7151.69\"",
            "-H", "sec-ch-ua-full-version-list: \"Google Chrome\";v=\"137.0.7151.69\", \"Chromium\";v=\"137.0.7151.69\", \"Not/A)Brand\";v=\"24.0.0.0\"",
            "-H", "sec-ch-ua-mobile: ?0",
            "-H", "sec-ch-ua-model: \"\"",
            "-H", "sec-ch-ua-platform: \"macOS\"",
            "-H", "sec-ch-ua-platform-version: \"14.1.2\"",
            "-H", "sec-fetch-dest: empty",
            "-H", "sec-fetch-mode: cors",
            "-H", "sec-fetch-site: same-origin",
            "-H", "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "-H", "x-csrftoken: aECQxhUhZukiUWi2li8AaDPxKuTNsUZn",
            "-H", "x-requested-with: XMLHttpRequest",
            "--data-raw", f"page={page}&category={category}&xslug=&token=5a24562b91c22c654692267af6e7863c%3AAWbyLklSar5Qzwiw5KGYrKPbUKMP7%2B6RyJcb1QklbtTAwMzVCcaqaCi3fsoue%2F936fFvKL6VNOO3ODB6VZe0HmQJ6e0rR0jimI6jw%2BlJWXMh2AMMmWmknY0sKto8fYJkgG8QLqBiiKjD2zEhJqMdRmDuki8088JnwhAEOYkXG8Q%3D&tokev=55ebab62&search=&qid=1&scr=1&scr_vw=977&scr_vh=962&scr_dw=1680&scr_dh=1050&scr_daw=1680&scr_dah=1050&scr_ddw=977&scr_ddh=1827&scr_ms=1749645833869&scr_wd=0&href=https%3A%2F%2Fpcpartpicker.com%2Fproducts%2F{category}%2F%23page%3D{page}&plg=5&scr_mme=1&scr_mmw=742&scr_mmh=212&zp_kpm=0&scr_msi=1749645833799&zp_p=0"
        ]

        result = subprocess.run(curl_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            print(f"Error executing curl command: {result.stderr.decode('utf-8')}")
            return None
            
        response = result.stdout.decode('utf-8')
        if not response:
            print("Empty response received from server")
            return None
            
        return response
    except Exception as e:
        print(f"Error in fetch_category_data: {str(e)}")
        return None


def parse_common_fields(row, real_id, data):
    link_tag = row.select_one('.td__name a')
    link = link_tag['href']
    product_id = link.split('/')[-1]
    name = row.select_one('.td__nameWrapper p').text.strip()
    price = row.select_one('.td__price').text.strip().split('\n')[0]
    rating_text = row.select_one('.td__rating')
    rating_count = (
        rating_text.text.strip()[rating_text.text.find('(')+1:rating_text.text.find(')')]
        if rating_text else None
    )
    image_url = data['data'].get(real_id, {}).get('img', None)

    return {
        'id': real_id,
        'product_id': product_id,
        'name': name,
        'link': f'https://pcpartpicker.com{link}',
        'price': price,
        'rating_count': rating_count,
        'image_url': image_url,
    }


def parse_specs(row, category):
    if category == "cpu":
        core_count = row.select_one('.td__spec--1')
        base_clock = row.select_one('.td__spec--2')
        boost_clock = row.select_one('.td__spec--3')

        return {
            'core_count': core_count.text.strip().split('\n')[-1].strip() if core_count else None,
            'base_clock': base_clock.text.strip().split('\n')[-1].strip() if base_clock else None,
            'boost_clock': boost_clock.text.strip().split('\n')[-1].strip() if boost_clock else None,
        }
    elif category == "cpu-cooler":
        airflow = row.select_one('.td__spec--1')
        noise_level = row.select_one('.td__spec--2')
        rpm = row.select_one('.td__spec--3')
        return {
            'airflow': airflow.text.strip().split('\n')[-1].strip() if airflow else None,
            'noise_level': noise_level.text.strip().split('\n')[-1].strip() if noise_level else None,
            'rpm': rpm.text.strip().split('\n')[-1].strip() if rpm else None,
        }
    elif category == "motherboard":
        socket = row.select_one('.td__spec--1')
        chipset = row.select_one('.td__spec--2')
        form_factor = row.select_one('.td__spec--3')
        memory_slots = row.select_one('.td__spec--4')
        return {
            'socket': socket.text.strip().split('\n')[-1].strip() if socket else None,
            'chipset': chipset.text.strip().split('\n')[-1].strip() if chipset else None,
            'form_factor': form_factor.text.strip().split('\n')[-1].strip() if form_factor else None,
            'memory_slots': memory_slots.text.strip().split('\n')[-1].strip() if memory_slots else None,
        }
    elif category == "memory":
        speed = row.select_one('.td__spec--1')
        modules = row.select_one('.td__spec--2')
        price_per_gb = row.select_one('.td__spec--3')
        first_word_latency = row.select_one('.td__spec--4')
        return {
            'speed': speed.text.strip().split('\n')[-1].strip() if speed else None,
            'modules': modules.text.strip().split('\n')[-1].strip() if modules else None,
            'price_per_gb': price_per_gb.text.strip().split('\n')[-1].strip() if price_per_gb else None,
            'first_word_latency': first_word_latency.text.strip().split('\n')[-1].strip() if first_word_latency else None,
        }
    elif category == "internal-hard-drive":
        capacity = row.select_one('.td__spec--1')
        type = row.select_one('.td__spec--2')
        cache = row.select_one('.td__spec--3')
        interface = row.select_one('.td__spec--4')
        return {
            'capacity': capacity.text.strip().split('\n')[-1].strip() if capacity else None,
            'type': type.text.strip().split('\n')[-1].strip() if type else None,
            'cache': cache.text.strip().split('\n')[-1].strip() if cache else None,
            'interface': interface.text.strip().split('\n')[-1].strip() if interface else None,
        }
    elif category == "video-card":
        chipset = row.select_one('.td__spec--1')
        memory = row.select_one('.td__spec--2')
        core_clock = row.select_one('.td__spec--3')
        boost_clock = row.select_one('.td__spec--4')
        return {
            'chipset': chipset.text.strip().split('\n')[-1].strip() if chipset else None,
            'memory': memory.text.strip().split('\n')[-1].strip() if memory else None,
            'core_clock': core_clock.text.strip().split('\n')[-1].strip() if core_clock else None,
            'boost_clock': boost_clock.text.strip().split('\n')[-1].strip() if boost_clock else None,
        }
    elif category == "power-supply":
        wattage = row.select_one('.td__spec--1')
        efficiency = row.select_one('.td__spec--2')
        modular = row.select_one('.td__spec--3')
        form_factor = row.select_one('.td__spec--4')
        return {
            'wattage': wattage.text.strip().split('\n')[-1].strip() if wattage else None,
            'efficiency': efficiency.text.strip().split('\n')[-1].strip() if efficiency else None,
            'modular': modular.text.strip().split('\n')[-1].strip() if modular else None,
            'form_factor': form_factor.text.strip().split('\n')[-1].strip() if form_factor else None,
        }
    elif category == "case":
        type = row.select_one('.td__spec--1')
        color = row.select_one('.td__spec--2')
        power_supply = row.select_one('.td__spec--3')
        side_panel = row.select_one('.td__spec--4')
        return {
            'type': type.text.strip().split('\n')[-1].strip() if type else None,
            'color': color.text.strip().split('\n')[-1].strip() if color else None,
            'power_supply': power_supply.text.strip().split('\n')[-1].strip() if power_supply else None,
            'side_panel': side_panel.text.strip().split('\n')[-1].strip() if side_panel else None,
        }
    else:
        return {}


def parse_html(html, data, category):
    soup = BeautifulSoup(html, 'html.parser')
    products = []

    for row in soup.find_all('tr', class_='tr__product'):
        real_id = row.get('data-pb-id')
        try:
            common_fields = parse_common_fields(row, real_id, data)
            specs = parse_specs(row, category)
            products.append({**common_fields, **specs})
        except Exception as e:
            print(f"Error parsing product row for ID {real_id}:", e)

    return products


def save_to_json(products, category):
    folder_path = os.path.join("output", category)
    os.makedirs(folder_path, exist_ok=True)
    output_file = os.path.join(folder_path, "products.json")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(products)} products to {output_file}")
    except Exception as e:
        print("Failed to save JSON:", e)


def main(category):
    all_products = []
    page = 1
    
    while True:
        print(f"Fetching page {page}...")
        response = fetch_category_data(category, page)
        if not response:
            print("Failed to fetch data from server")
            break

        try:
            data = json.loads(response)
            if 'html' not in data:
                print("Invalid response format: 'html' field missing")
                break
                
            html = data['html']
            products = parse_html(html, data, category)
            
            if not products:  # If no products found, we've reached the end
                print("No more products found")
                break
                
            all_products.extend(products)
            print(f"Found {len(products)} products on page {page}")
            
            # Check if we've reached the last page
            if len(products) < 100:  # Assuming 100 is the max products per page
                print("Reached last page")
                break
                
            page += 1
            
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {str(e)}")
            print("Raw response:", response[:200] + "..." if len(response) > 200 else response)
            break
        except Exception as e:
            print(f"Unexpected error while processing response: {str(e)}")
            break

    print(f"Total products found: {len(all_products)}")
    save_to_json(all_products, category)

# cpu-cooler, video-card, motherboard, memory, internal-hard-drive, power-supply, case
if __name__ == "__main__":
    category = "case"  # or "video-card", "motherboard", etc.
    main(category)
